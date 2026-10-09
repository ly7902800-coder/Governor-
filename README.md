# Cloud Flutter Studio

A phone-friendly cloud development workspace for Flutter projects.

## Current foundation
- Next.js + TypeScript web workspace with Monaco code editor.
- Flutter starter app under `flutter_template/`.
- GitHub Actions workflow that builds a real Android APK and uploads it as an artifact.
- AI provider selector (OpenRouter, OpenAI, Gemini, Anthropic), server-side readiness status, and recent conversation context preserved when switching providers. When configured, AI can return structured full-file edits that are applied to the current browser workspace.
- Automatic browser-local project saving, JSON backup export/import, and recent AI conversation persistence.

## Important status
The APK workflow builds the included starter Flutter app, not every unsaved browser workspace file. The editor currently provides a source-based visual draft, not a real Flutter Engine preview. AI-generated edits are applied to browser workspace files when the selected provider returns the required structured JSON; the workspace is still local until exported. True interactive preview of arbitrary edited Dart requires a separately deployed, sandboxed Flutter Web compilation/runtime service and a project-sync API. The editor autosaves locally in the same browser; JSON backup/import moves projects between devices. It does not yet provide remote cloud storage or GitHub synchronization.

Real email/password authentication requires a secure backend and persistent user database. Google and GitHub sign-in additionally require OAuth application configuration and redirect URLs; these cannot be made real for arbitrary apps without provider setup. The Login UI starter is explicitly a UI template, not live authentication.

## Run the web workspace
Use Node.js 20+:

```bash
npm install
npm run dev
```

## Build APK
Open **Actions → Build Flutter APK → Run workflow**. Download `cloud-flutter-studio-apk` from the successful run's artifacts.

## Optional AI providers
Configure server-side environment variables in the deployed web service: `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, and/or `ANTHROPIC_API_KEY`. Optional model overrides: `OPENROUTER_MODEL`, `OPENAI_MODEL`, `GEMINI_MODEL`, and `ANTHROPIC_MODEL`. The `/api/ai` GET endpoint reports which providers are configured without exposing secrets. GitHub repository secrets are not automatically available to a running website unless the deployment pipeline explicitly maps them into its server environment. Never put keys in client-side code or commit them to Git.
