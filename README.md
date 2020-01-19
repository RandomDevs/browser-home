# Browser home

Browser extension for viewing your bookmarks when opening a new window or tab

<img src="screenshot.png" alt="Screenshot of Browser Home">

## Contribute

### Spinning up environment

**1. Install the dependencies**

```bash
npm install
```

**2. Precache icons from blacklisted websites**

```bash
npm run precache-icons
```

**3. Start building**

```bash
npm run dev
```

**4. Load addon into browser**

Start Firefox and enter `about:debugging` into the address bar. Load `public/manifest.json` as a temporary addon.

