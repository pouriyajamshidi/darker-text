// Dims near-white text to a softer gray, everywhere, and keeps doing it as
// pages change. The gray is picked per element: we blend the text toward its
// own background only as far as TARGET_CONTRAST allows, so it stays readable.

const TARGET_CONTRAST = 7; // WCAG AAA for body text. Lower it for dimmer text.
const MAX_BLEND = 0.45; // never blend more than this far toward the background
const MIN_LUMINANCE = 0.5; // how bright text must be before we touch it (~#bcbcbc)
const MARK = "data-darker-text";
// localName, not tagName: it is lowercase for HTML and matches SVG as authored.
const SKIP = new Set([
    "script",
    "style",
    "noscript",
    "title",
    "svg",
    "canvas",
    "iframe",
]);

function parse(color) {
    const parts = color.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return null;
    if (parts.length > 3 && Number(parts[3]) === 0) return null; // transparent
    return parts.slice(0, 3).map(Number);
}

function luminance([r, g, b]) {
    const [R, G, B] = [r, g, b].map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

function mix(from, to, amount) {
    return from.map((c, i) => c + (to[i] - c) * amount);
}

// Nearest painted background: colors are see-through by default, so the real
// backdrop of a piece of text can be several ancestors up.
function backgroundOf(element) {
    for (let node = element; node; node = node.parentElement) {
        const color = parse(getComputedStyle(node).backgroundColor);
        if (color) return color;
    }
    return [255, 255, 255]; // unknown: assume light, which means we do nothing
}

// How far the text can fade into its background before it stops being readable.
function blend(text, background) {
    const readable = (amount) =>
        contrast(mix(text, background, amount), background) >= TARGET_CONTRAST;

    let low = 0;
    let high = MAX_BLEND;
    if (readable(high)) return high;

    for (let i = 0; i < 8; i++) {
        const middle = (low + high) / 2;
        if (readable(middle)) low = middle;
        else high = middle;
    }
    return low;
}

function dim(element) {
    const text = parse(getComputedStyle(element).color);
    if (!text || luminance(text) < MIN_LUMINANCE) return;

    const background = backgroundOf(element);
    if (contrast(text, background) <= TARGET_CONTRAST) return; // no headroom

    const gray = mix(text, background, blend(text, background)).map(Math.round);
    element.style.setProperty("color", `rgb(${gray.join(", ")})`, "important");
    element.setAttribute(MARK, "");
}

function hasOwnText(element) {
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) return true;
    }
    return false;
}

// We color the element that owns the text, not its children: an inherited color
// is the weakest kind, so anything the site deliberately colors still wins.
function scan(root) {
    if (!(root instanceof Element) || SKIP.has(root.localName)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (element) =>
            SKIP.has(element.localName)
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT,
    });

    for (let element = root; element; element = walker.nextNode()) {
        if (!element.hasAttribute(MARK) && hasOwnText(element)) dim(element);
    }
}

function undim() {
    for (const element of document.querySelectorAll(`[${MARK}]`)) {
        element.style.removeProperty("color");
        element.removeAttribute(MARK);
    }
}

// Infinite feeds (X, YouTube, Reddit) swap their content in without a reload,
// so the observer is what makes this keep working while you scroll.
const pending = new Set();
let scheduled = false;

function flush() {
    scheduled = false;
    const roots = [...pending];
    pending.clear();
    roots.forEach(scan);
}

function queue(node) {
    const element = node instanceof Element ? node : node.parentElement;
    if (!element) return;

    pending.add(element);
    if (scheduled) return;
    scheduled = true;
    requestIdleCallback(flush, { timeout: 300 });
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "characterData") queue(mutation.target);
        else mutation.addedNodes.forEach(queue);
    }
});

function start() {
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
    });
    scan(document.documentElement);
}

function stop() {
    observer.disconnect();
    pending.clear();
    undim();
}

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => enabled && start());

chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) changes.enabled.newValue ? start() : stop();
});
