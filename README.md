# AnonMessage

**Share your link. Receive anonymous messages. Manage your inbox.**

AnonMessage lets you create a personal inbox and share its public link. Anyone with that link can send you a message without creating an account. Visitors can also generate friendly conversation starters with Google Gemini.

You sign in to read messages, delete them, or pause incoming messages.

## Contents

- [Features](#features)
- [How to use the app](#how-to-use-the-app)
- [Screenshots](#screenshots)
- [Technology](#technology)
- [Local setup](#local-setup)
- [Email verification and authentication](#email-verification-and-authentication)
- [API endpoints](#api-endpoints)
- [Rate limits](#rate-limits)
- [Privacy and stored data](#privacy-and-stored-data)
- [Project structure](#project-structure)
- [Commands and validation](#commands-and-validation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Author and license](#author-and-license)

## Features

| Feature | What it does |
| --- | --- |
| Email signup | Creates an account and sends a six-digit verification code. |
| Google sign-in | Lets you use a Google-based account without a separate app password. |
| Personal public link | Gives visitors a `/u/your_username` page to write to you. |
| Anonymous sending | Allows visitors to send messages without signing in. |
| AI suggestions | Generates three question ideas to fill the message box. |
| Private dashboard | Shows your messages and lets you refresh or delete them. |
| Message controls | Lets you turn incoming messages on or off. |
| Responsive interface | Supports phone, tablet, and desktop layouts. |

**Anonymous means the inbox does not show a sender account or sender identity.** It does not mean the service has no technical metadata. See [Privacy and stored data](#privacy-and-stored-data).

## How to use the app

### Receive messages

1. Sign up with a username, email, and password, then enter the code emailed to you. Alternatively, use Google from the sign-in page.
2. Sign in and open your dashboard.
3. Copy your personal link, such as `https://your-domain.com/u/alex`.
4. Share the link with friends or your audience.
5. Read messages in the dashboard. Delete unwanted messages or turn off message acceptance to pause your inbox.

The email signup form accepts usernames of 2–20 letters, numbers, or underscores, a valid email, and a password of at least six characters. Choose a strong, unique password.

### Send a message

1. Open someone's `/u/username` link. No account is required.
2. Write a message of **10–300 characters**, or select a suggested question.
3. Submit it. The recipient must exist, accept messages, and have available rate-limit quota.

AI suggestions only fill the text box; they do not send automatically.

## Screenshots

<details>
<summary>Home page</summary>

![AnonMessage home page](https://github.com/user-attachments/assets/e51429a1-952b-4528-bc73-994f22e64b53)

</details>

<details>
<summary>Inbox dashboard</summary>

![Inbox dashboard](https://github.com/user-attachments/assets/cfa9e170-7882-42e7-86b6-e4f687689cb2)

</details>

<details>
<summary>Public message page</summary>

![Anonymous message page](https://github.com/user-attachments/assets/8ec7df1e-5aa8-4cf7-84bf-ab3500726189)

</details>

## Technology

Versions below describe `package.json`; dependencies with version ranges may resolve to newer compatible releases.

| Area | Tools |
| --- | --- |
| App and server | Next.js **16.2.10**, App Router, TypeScript |
| Interface | React **19.2.4**, Tailwind CSS 4, shadcn components, Lucide icons, Sonner notifications |
| Forms | React Hook Form, Zod, Axios |
| Authentication | NextAuth 4, Google OAuth, JWT sessions, bcryptjs |
| Database | MongoDB with Mongoose 9 |
| Email | Resend and React Email |
| AI | AI SDK 7 and `@ai-sdk/google` 4 |
| Visual effects | Motion, Three.js, React Three Fiber/Drei |

The active AI route uses **`gemini-3.1-flash-lite`** in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts). Model access depends on your Google API account. OpenAI packages are installed, but this route uses Google and does not require an OpenAI key.

## Local setup

### 1. Prerequisites

- **Node.js 22 or newer**, npm, and Git. The AI SDK packages require Node 22 or newer, even though Next.js itself supports earlier versions.
- A reachable MongoDB database, local or hosted.
- A Resend account/API key for verification emails.
- A Google OAuth web application for Google sign-in.
- A Google Generative AI API key for suggestions.

### 2. Clone and install

```bash
git clone https://github.com/manvithreddy07/anon_message.git
cd anon_message
npm install
```

The current lockfile has a known `@emnapi/wasi-threads` version mismatch that can cause `npm ci` to fail. For local evaluation without rewriting the lockfile, use `npm install --package-lock=false`. Review any dependency/lockfile changes separately before committing them.

### 3. Configure environment variables

Create **`.env.local`** beside `package.json`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/anon_message
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=replace_with_your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=replace_with_your_google_oauth_client_secret
RESEND_API_KEY=replace_with_your_resend_api_key
GOOGLE_GENERATIVE_AI_API_KEY=replace_with_your_google_ai_api_key
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Database connection string for accounts, messages, and rate-limit counters. For Atlas, configure database credentials and network access too. |
| `NEXTAUTH_URL` | Full base URL of the app. Use the production HTTPS URL when deploying. |
| `NEXTAUTH_SECRET` | Private random value protecting NextAuth sessions; keep it consistent across instances. |
| `GOOGLE_CLIENT_ID` | Google OAuth web application's client ID. |
| `GOOGLE_CLIENT_SECRET` | Server-side secret for that OAuth application. |
| `RESEND_API_KEY` | Authorizes email sending. It is also needed during builds because the client initializes when its module loads. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Authorizes Gemini requests through the [Google AI SDK provider](https://ai-sdk.dev/providers/ai-sdk-providers/google). |

Generate a random NextAuth secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Never commit real credentials or prefix server secrets with `NEXT_PUBLIC_`. Environment files are ignored by this repository. Restart the development server after changing them.

### 4. Configure Google login

In Google Cloud, configure the OAuth consent screen and create a **web application** client. Register this local authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

For production, also register `https://your-domain.com/api/auth/callback/google`. Configure the corresponding app origin. If the OAuth application is in testing mode, add the permitted test users.

### 5. Configure verification email

The current helper sends from **`onboarding@resend.dev`**, with the subject **Mystery Message Verification Code**. That testing sender only sends to the email associated with your Resend account. To send to other users, verify your own domain in Resend and replace the `from` address in [`src/helpers/sendVerificationEmail.ts`](src/helpers/sendVerificationEmail.ts) with an address on that domain. See [Resend's sender restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

There is no sender-address environment variable in the current implementation. Changing only the API key does not replace the testing sender.

### 6. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep MongoDB reachable: public message and AI endpoints use it for shared rate limits too.

## Email verification and authentication

### Email/password accounts

1. The signup form sends `username`, `email`, and `password` to `/api/sign-up`.
2. The server checks for account conflicts, hashes the password with bcryptjs, and saves an unverified account in MongoDB.
3. It generates a six-digit verification code and stores it with a **one-hour expiry**.
4. `sendVerificationEmail()` submits the React Email template to Resend, addressed to the signup email.
5. On `/verify/username`, the user submits the code. `/api/verify-code` checks the stored code and expiry, then marks the account verified.
6. The user can sign in with either their email or username plus their password.

Unverified accounts cannot use password sign-in. If a code expires, repeat signup to obtain a new code for the unverified account. There is no dedicated resend-code endpoint. Accounts are saved before sending email, so a mail failure can leave an unverified account behind.

### Google accounts

NextAuth handles Google sign-in. New Google accounts receive a username based on their email prefix and are marked verified without the app's email-code step. They must continue using Google to sign in. Existing password accounts with the same email are not automatically linked to Google.

### Sessions

NextAuth uses JWT sessions through its cookie-based flow. Session callbacks expose account fields such as user ID and username, without copying passwords into those session fields. The dashboard requires sign-in; inbox, settings, and deletion endpoints also check the server session. Public message pages, sending, and suggestions do not require login.

## API endpoints

All paths are relative to the app's base URL. For example, `/api/send-messages` is `http://localhost:3000/api/send-messages` locally. Send JSON request bodies with `Content-Type: application/json`.

**Public:** no login needed. **Session required:** include a valid NextAuth session cookie. These application endpoints do not use a custom bearer-token scheme.

| Method | Endpoint | Access | Input | Successful behavior / response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/sign-up` | Public | JSON: `username`, `email`, `password` | Creates/updates an unverified account and requests email delivery. `201`: `success`, `message`. |
| `GET` | `/api/check-username-unique` | Public | Query: `?username=alex` | Checks format and whether a verified account uses the name. `200`: `success`, `message`. A taken name returns `success: false`. |
| `POST` | `/api/verify-code` | Public | JSON: `username`, `code` (string) | Verifies the code and expiry. `200`: `success`, `message`. |
| `GET`, `POST` | `/api/auth/[...nextauth]` | Depends on auth action | NextAuth-managed inputs | Handles providers, sign-in, callbacks, session, CSRF, and sign-out. Use NextAuth client helpers for this flow. |
| `GET` | `/api/accept-messages` | Session required | None | Reads your setting. `200`: `success`, `isAcceptingMessages`. |
| `POST` | `/api/accept-messages` | Session required | JSON: `acceptMessages` (boolean) | Updates your setting. `200`: `success`, `message`, `isAcceptingMessages`. |
| `POST` | `/api/send-messages` | Public, rate limited | JSON: `username`, `content` | Sends to an accepting recipient. `201`: `success`, `message`. |
| `GET` | `/api/get-messages` | Session required | None | Returns your inbox, newest first. `200`: `messages` array. |
| `DELETE` | `/api/delete-message/:messageid` | Session required | Message ID in URL | Deletes a message from your inbox. `200`: `success`, `message`. |
| `POST` | `/api/chat` | Public, rate limited | No body required | Generates three suggestions. `200`: `{ "text": "question1||question2||question3" }`. |

`/api/auth/[...nextauth]` is a catch-all route name, not a literal URL to call. Concrete examples include `/api/auth/session` and `/api/auth/callback/google`.

### Signup and verification

```http
POST /api/sign-up
Content-Type: application/json

{"username":"alex","email":"alex@example.com","password":"replace-with-a-strong-password"}
```

After receiving the email, submit its code as a string:

```http
POST /api/verify-code
Content-Type: application/json

{"username":"alex","code":"123456"}
```

`123456` is an example, not a working code. Successful verification returns:

```json
{"success":true,"message":"Account verified successfully"}
```

### Check a username

`GET /api/check-username-unique?username=alex` returns `200` for both an available name and a name already used by a verified user. Read the JSON `success` value rather than relying only on the HTTP status. Invalid format returns `400`.

### Send an anonymous message

```http
POST /api/send-messages
Content-Type: application/json

{"username":"alex","content":"What is a hobby you would like to try?"}
```

```json
{"message":"Message sent successfully","success":true}
```

The server accepts a trimmed, nonempty username up to 254 characters to support Google-generated usernames. Message content is trimmed and must be 10–300 characters. The entire body is limited to **4096 bytes**. Malformed JSON, non-string values, query-operator objects, and invalid content are rejected before recipient lookup.

### Read or change message acceptance

`GET /api/accept-messages` reads the signed-in user's setting. To update it, run this from a signed-in browser on the app:

```javascript
const response = await fetch('/api/accept-messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ acceptMessages: false }),
});
const result = await response.json();
```

```json
{"success":true,"message":"Message acceptance status updated successfully","isAcceptingMessages":false}
```

The update response contains the setting, not the full user document.

### Read or delete messages

Use `GET /api/get-messages` with your session cookie. Messages have an `_id`, `content`, and `createdAt`. An empty inbox returns `messages: []`, `success: true`, and a message. A populated inbox currently returns the `messages` array without a `success` field; clients should not assume every successful endpoint uses the same response envelope.

Use `DELETE /api/delete-message/<message-id>` with the same session to delete a message. The server scopes deletion to the signed-in user's inbox. No JSON body is required.

### Generate suggestions

Send `POST /api/chat` without a body. This is a fixed question-suggestion endpoint, not an open-ended chatbot. It uses a server-defined prompt and returns a `text` string separated by `||`. The visitor's drafted message is not required or used as the prompt.

### Status codes and errors

| Status | Meaning |
| --- | --- |
| `200` | Successful read, verification, setting update, deletion, or generation. Username availability may still be false. |
| `201` | Signup/email request completed or message sent. |
| `400` | Invalid input, malformed/oversized message body, duplicate signup, or incorrect/expired code. |
| `401` | Missing session on an authenticated endpoint. |
| `403` | Recipient has paused incoming messages. |
| `404` | Recipient, account, or message not found, depending on the endpoint. |
| `429` | Rate limit reached. Read `Retry-After` before retrying. |
| `500` | Server, database, email, or AI failure; inspect server/provider logs. |

Most application errors include `success: false` and `message`. `/api/chat` uses a `message` field for provider/server failures; NextAuth has its own formats. Check HTTP status before using the payload. Input validation is endpoint-specific; the shared form schemas do not imply that every server route validates all fields identically.

## Rate limits

The public message and AI endpoints use atomic MongoDB counters shared across app instances. Limits use fixed time windows, not rolling windows.

| Endpoint | Scope | Maximum |
| --- | --- | --- |
| `/api/send-messages` | Per client | 5 requests per minute |
| `/api/send-messages` | All clients together | 100 requests per minute |
| `/api/send-messages` | Per recipient | 30 requests per hour |
| `/api/chat` | Per client | 3 requests per minute |
| `/api/chat` | All clients together | 60 requests per hour and 500 per day |

Requests consume counters as each check is reached; malformed, rejected, or failed requests can consume quota. Adjacent windows can allow a burst across the boundary. Over-limit requests receive `429` with `Retry-After` in seconds.

On Vercel, the helper hashes the client address from the platform's `x-vercel-forwarded-for` header. Outside Vercel, or when no valid platform address is available, users share a conservative fallback client bucket. Local users therefore share the per-client quota. Do not manually set `VERCEL=1` on an untrusted host to trust arbitrary incoming headers. See [Vercel request headers](https://vercel.com/docs/headers/request-headers).

Counters live in `api_rate_limits` with a TTL expiry index for automatic cleanup. The database account must be able to create this collection/index and update counters. Failed quota checks prevent the message/AI operation from proceeding.

Gemini calls also have a **256-output-token limit**, **no automatic retries**, and a **15-second abort timeout**. These reduce usage but do not guarantee a monetary spending cap; configure provider-side billing controls too. Signup and code verification do not currently use this shared limiter.

## Privacy and stored data

- **Accounts:** MongoDB stores usernames, emails, authentication provider, verification status, acceptance setting, optional image, and bcrypt password hashes for password accounts.
- **Verification:** Codes and expiry timestamps are stored on accounts. The current verification handler marks an account verified but does not clear those fields.
- **Messages:** Content and timestamps are embedded in the recipient's account document with a message ID. There is no sender-account field in the message schema.
- **Rate limits:** Counter documents contain hashed bucket IDs, counts, and expiry timestamps. On Vercel, client IPs participate in deriving those IDs; raw IPs are not stored in these counter documents.
- **External services:** Resend processes email delivery, and Google handles OAuth and AI requests. Hosting and service providers may retain logs or metadata.

Do not treat this as guaranteed untraceable communication. Avoid sending sensitive personal information. AI suggestions are conversation starters; the app does not perform AI moderation on submitted messages.

## Project structure

```text
anon_message/
├── emails/VerificationEmail.tsx    # Verification email template
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── (app)/                 # Home and dashboard
│   │   ├── (auth)/                # Sign-in, signup, verification
│   │   ├── api/                   # Server endpoints
│   │   └── u/[username]/          # Public message page
│   ├── components/                # Navbar, message cards, UI components
│   ├── context/AuthProvider.tsx   # NextAuth session provider
│   ├── helpers/sendVerificationEmail.ts
│   ├── lib/                       # Database, email, rate-limit helpers
│   ├── model/User.ts              # Account and embedded message schemas
│   ├── schemas/                   # Zod form/input schemas
│   ├── types/                     # Response and session types
│   ├── messages.json              # Sample messages for the interface
│   └── middleware.ts              # Page access redirects
├── package.json
└── README.md
```

## Commands and validation

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build for production; needs configured environment variables. |
| `npm start` | Serve an already-built production app. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Check TypeScript without generating application output. |

There is no committed automated test suite or `npm test` script. For a manual check: create and verify an account, sign in, send from a separate signed-out browser, refresh the inbox, pause incoming messages, and delete a message. Also check Google sign-in, suggestions, invalid content, and rate-limit responses.

## Deployment

The app needs a Node.js server runtime and MongoDB; it is not a static-only site.

1. Import the repository into Vercel or another compatible Next.js Node.js host.
2. Use Node.js 22 or newer.
3. Add all environment variables from local setup. Set `NEXTAUTH_URL` to your production HTTPS URL.
4. Register the production Google callback URL and configure permitted OAuth users.
5. Verify a Resend sender domain and update the helper's sender before accepting public email signups.
6. Configure MongoDB connectivity and rate-limit collection/index permissions.
7. Build and deploy. For self-hosting, run `npm run build`, then `npm start`.
8. Test email delivery, verification, both login methods, anonymous messages, dashboard controls, and rate limits on the deployed domain.

Monitor service errors and usage, and configure provider quotas. On non-Vercel hosts, plan for the shared client quota described above.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Build reports a missing Resend API key | Set `RESEND_API_KEY` in both build and runtime environments. |
| Signup reports success but no email arrives | Check spam, Resend delivery logs, sender verification, and recipient restrictions. The current helper catches exceptions but does not inspect a returned Resend `error`, so app success alone is not proof of delivery. |
| Code expired | Repeat signup for the unverified account and use the newest emailed code. |
| Password login says unverified | Complete the email-code step first. |
| Google redirect mismatch | Match the callback scheme, domain, port, and path in Google Cloud and `NEXTAUTH_URL`. |
| Login method rejected | Use the method associated with the account; automatic provider linking is not implemented. |
| Database connection fails | Check the URI, credentials, database availability, and network access. |
| Suggestions fail | Check Google AI credentials, configured model access, quotas, server logs, and MongoDB connectivity. |
| `429 Too many requests` | Wait for `Retry-After`; local/non-Vercel users share the client quota. |
| Recipient cannot receive messages | Check username, acceptance setting, content length, and available quota. |
| `npm ci` fails on `@emnapi/wasi-threads` | See the installation note; keep dependency fixes separate from unrelated features. |
| Next.js warns about `middleware` | The project still uses that filename; Next.js 16 recommends `proxy`. The warning does not mean migration is already complete. |

Password reset, a dedicated resend-code endpoint, real-time inbox updates, and message moderation are not currently implemented.

## Contributing

1. Fork or clone the repository and create a focused branch.
2. Follow setup instructions and inspect the relevant code.
3. Make the smallest necessary changes.
4. Run lint, type checks, a build when credentials are available, and relevant manual checks.
5. Open a PR explaining the change and validation. Keep secrets and unrelated dependency updates out of it.

Report security concerns without posting real credentials or users' private data.

## Author and license

Created by **Manvith Reddy** — [GitHub](https://github.com/manvithreddy07) · [LinkedIn](https://www.linkedin.com/in/manvith-reddy-medagam-208092321/).

There is currently no standalone license file in this repository. Do not assume an MIT license or other reuse permissions until the maintainer adds an explicit license.
