# Danger Writer

Danger Writer is a fork of Manu Ebert's [The Most Dangerous Writing App](https://github.com/maebert/themostdangerouswritingapp). Manu wrote the original over two glasses of wine on a Sunday afternoon and put it out in the open. This fork exists because of that. Thank you, Manu.

You write. If you stop typing for more than five seconds, the words go away. Finish the session and you can keep what you wrote.

The live app is at [https://util.chad.ml/write/](https://util.chad.ml/write/). This repository is [miller-oaks/danger-writer](https://github.com/miller-oaks/danger-writer).

## What this fork adds

- **Hardcore.** The text blurs, and only the word you are typing stays visible.
- **Reveal at end.** When Hardcore is on, you can lift that blur automatically at the end of the session, or leave it until you press Reveal.
- **Continue Session.** After you finish, you can keep the text and start another session, or start fresh.
- **Copy.** Copy the finished text to the clipboard.
- **Home.** Go back to the start screen. If the text from this session is still there, Home asks before it wipes it.
- **Wipe confirms.** New Session asks the same question before it erases what you just wrote.
- **Night mode.** A dark theme, with a toggle on each page.
- **Offline.** The published app is a PWA. After it has loaded once, it works without a network. In Safari on a Mac, File › Add to Dock turns it into a Dock app. A short tip on the start screen says so, and you can dismiss it.
- **No analytics.** Nothing is tracked. The app runs in the browser, and your writing never leaves the device.

A session can be a number of minutes, a number of words, or no limit. No deleting keeps you from erasing characters you have already typed. Stopping for five seconds still clears the page.

## Run it locally

Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/), then:

```bash
yarn install
yarn start
```

`yarn start` runs a development server. `yarn build` writes a production build into `build/`. The published site is built from the `deploy` branch, which also generates the offline service worker.

## Branches

- `master` is upstream, left as Manu published it.
- `custom` is for changes that could be offered back upstream.
- `personalize` is for changes that belong only to this fork, including this README.
- `deploy` is `custom` plus `personalize`. That is the branch we publish at [util.chad.ml/write](https://util.chad.ml/write/).

## License

Danger Writer is free software under the [GNU General Public License v3.0](LICENSE.md). The original app is licensed the same way.
