# Governor Studio: deploy the missing services

The repository now contains the application-side endpoints and the real Flutter build service. These features are not live until the web app and runtime are deployed with the environment values below.

## 1. Web application environment

Configure these on the Next.js hosting provider (not as GitHub Actions secrets alone):

- `DATABASE_URL`: a PostgreSQL connection string from your database host. The application creates its account/project tables on first use.
- `SESSION_SECRET`: a cryptographically random secret of at least 32 characters.
- `APP_BASE_URL`: public HTTPS origin of Governor Studio, with no trailing slash.
- `FLUTTER_RUNTIME_URL`: public HTTPS origin of the separately deployed runtime service.
- `RUNTIME_SHARED_SECRET`: the same random secret as the runtime service, at least 32 characters.
- `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`: only the providers the platform chooses to enable.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: required for Google OAuth.
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: required for GitHub OAuth.

Never commit these values into source control or place server secrets in `NEXT_PUBLIC_*` variables.

## 2. Deploy the Flutter runtime

Deploy the `runtime/` directory as a Docker service on a host that supports long-running containers, outbound network access, and sufficient CPU/RAM for Flutter builds (Railway, Fly.io, or a comparable Docker host).

Runtime environment:

- `RUNTIME_SHARED_SECRET`: exactly the same value configured on the web app.
- `PUBLIC_RUNTIME_URL`: public HTTPS origin of this runtime service, with no trailing slash.
- Optional `RUNTIME_WORK_DIR`: writable workspace root; defaults to `/tmp/governor-runtime`.
- Optional `PORT`: defaults to `8090`.

The service provides `GET /health`, `POST /build/web`, and `POST /build/apk`. Build endpoints require `X-Runtime-Token`, validate relative file paths and project size, and execute Flutter in a disposable workspace. The web build output is retained for browser preview. Set a platform-level request timeout long enough for Flutter compilation.

After the service is deployed, set its HTTPS origin as `FLUTTER_RUNTIME_URL` on the Next.js app and redeploy that app.

## 3. OAuth callback URLs

Register these exact HTTPS callback URLs in each provider's developer console:

- Google: `https://YOUR_GOVERNOR_DOMAIN/api/auth/oauth/callback/google`
- GitHub: `https://YOUR_GOVERNOR_DOMAIN/api/auth/oauth/callback/github`

Replace `YOUR_GOVERNOR_DOMAIN` with the actual public hostname and set `APP_BASE_URL` to the same origin. OAuth cannot work until provider client IDs/secrets and callback URLs match.

## 4. Current account caveats

- Email registration and login use PostgreSQL-backed users, scrypt password hashes, and signed HttpOnly session cookies.
- Google/GitHub OAuth requires the configuration above.
- Email verification delivery and password-reset email flows are not implemented yet. New email/password accounts are marked unverified. Do not use this as a sensitive production identity service until verification, recovery, rate limiting, and monitoring are added.
- Cloud projects are private to the authenticated user and stored in PostgreSQL.
- AI requests still require the platform administrator to configure at least one provider key.
- The runtime service can compile actual Flutter Web previews and APKs from the submitted workspace once deployed and reachable.

## 5. Build checks

The web CI workflow runs TypeScript checking and the Next.js production build. The APK GitHub Actions workflow builds the repository's starter app; use the new **Build this project APK** button to compile the current editor workspace through the deployed runtime.
