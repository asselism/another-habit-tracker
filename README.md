Visit it at https://asselism.github.io/another-habit-tracker/

## Fork setup

1. **Create a GitHub Gist** — Create a new gist with a file named `habits.json` containing `{}`. Note the gist ID from the URL.

2. **Update gist ID** — In `src/gist.js`, replace `HABITS_GIST_ID` with your gist ID.

3. **Generate a GitHub PAT** — Go to GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens. Create a token with **Gists** read/write permission. You'll enter this in the app to unlock editing.

4. **Update base path** — In `vite.config.js`, change the `base` value to match your repo name (e.g. `/your-repo-name/`).

5. **Deploy to GitHub Pages**:
   ```
   npm install
   npm run deploy
   ```
   Then in your repo's Settings > Pages, set the source branch to `gh-pages`.
