# Cloud Flutter Studio

A phone-friendly cloud development workspace for Flutter projects.

## Current foundation
- Next.js + TypeScript web workspace with Monaco code editor.
- Flutter starter app under `flutter_template/`.
- GitHub Actions workflow that builds a real Android APK and uploads it as an artifact.
- Optional AI provider endpoint using server-side environment variables.

## Important status
The APK workflow is implemented for the included starter Flutter app. Live Flutter hot reload in the browser requires a separate persistent Flutter Web runtime service; it is not falsely represented as active by the initial UI.

## Run the web workspace
Use Node.js 20+:

```bash
npm install
npm run dev
```

## Build APK
Open **Actions → Build Flutter APK → Run workflow**. Download `cloud-flutter-studio-apk` from the successful run's artifacts.

## Optional AI providers
Configure server-side environment variables in the deployment host: `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `ANTHROPIC_API_KEY`. Never place keys in client-side code or commit them to Git.
