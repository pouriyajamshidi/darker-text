const toggle = document.querySelector("#enabled");
const state = document.querySelector("#state");

function render(enabled) {
    toggle.checked = enabled;
    state.textContent = enabled ? "Dimming white text" : "Paused";
}

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => render(enabled));

toggle.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: toggle.checked });
    render(toggle.checked);
});
