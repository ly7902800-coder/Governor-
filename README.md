# Governor Studio

Phone-friendly Flutter development workspace with a Monaco editor and AI coding assistant.

## Implemented source features
- AI provider router for OpenRouter, OpenAI, Gemini and Anthropic, with structured file edits applied to the current editor workspace.
- Browser autosave and JSON backup import/export.
- PostgreSQL-backed account and cloud-project APIs.
- Email/password registration and sign-in with hashed passwords and signed HttpOnly session cookies.
- Google and GitHub OAuth routes, plus Account Center at `/account`.
- Cloud save/load controls in the editor.
- Dockerized Flutter runtime in `runtime/` for real Flutter Web compilation and APK builds from the current workspace.
- GitHub Actions workflow that builds the included starter Flutter APK.

## Hosted services must be configured
The web build passes CI, but external services are not live until the host configures them. See [runtime deployment guide](runtime/README.md).

Web host environment values:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: random secret, at least 32 characters
- `RESEND_API_KEY` and `EMAIL_FROM`: email verification and password recovery
- `APP_BASE_URL`: public HTTPS app origin
- `FLUTTER_RUNTIME_URL`: public HTTPS runtime origin
- `RUNTIME_SHARED_SECRET`: same value on the web app and runtime
- Optional AI provider keys: `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`
- OAuth credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

The runtime service needs `RUNTIME_SHARED_SECRET` and `PUBLIC_RUNTIME_URL`. Never commit secrets or expose them in client-side variables.

## Authentication status
Email registration now sends verification links and password reset uses expiring, single-use email links. Configure `RESEND_API_KEY` and `EMAIL_FROM` on the web server to enable both. OAuth requires the callback URLs in [runtime/README.md](runtime/README.md). Rate limiting is applied to shared AI and Flutter builds; add edge-level abuse protection and monitoring before a large public launch.

## Run locally
Requires Node.js 20+:

```bash
npm install
npm run dev
```

## Build starter APK
Open **Actions → Build Flutter APK → Run workflow**, then download `cloud-flutter-studio-apk` from a successful run.

AI provider keys must be set on the server environment; GitHub Actions secrets are not automatically available to a deployed website.
