# Darker Text

This extension reduces eye-strain by softening harsh white text on dark pages.

It works on any site. For each piece of text it finds the background behind it
and blends the text toward that background as far as it can while keeping a 7:1
contrast ratio, so the result is a readable gray rather than a fixed one. Text
that is already dim, that sits on a light background, or that the site colors on
purpose (links, buttons) is left alone.

A `MutationObserver` keeps it running as you scroll, so endlessly loading feeds
like X or YouTube stay dimmed as new content arrives.

Click the toolbar icon to switch it off and on. Switching it off restores the
original colors immediately, on every open tab, without a reload.

## Usage

Clone this repository, head to your browser's extension settings, enable
developer mode, click on `Load unpacked` and select the cloned directory. Tabs
that were already open need a reload the first time.

## Tuning

The constants at the top of `darker.js` control the effect:

- `TARGET_CONTRAST` - lower it for dimmer text
- `MAX_BLEND` - how far text may fade toward its background
- `MIN_LUMINANCE` - how bright text must be before it is touched

## Files

| File               | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `darker.js`        | finds white text and dims it, on every page      |
| `popup.html/css/js`| the on/off switch                                |
| `background.js`    | badges the toolbar icon when switched off        |
| `youtube.css`      | bumps YouTube's comment and description sizes    |
| `icons/make_icons.py` | redraws the toolbar icons                     |

## Tested on

- Google Chrome
- Opera

## Ideas

- [ ] Per-site on/off, instead of one global switch
- [ ] A slider for the contrast target in the popup
- [ ] Reach text inside shadow DOM
