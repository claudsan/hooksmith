<p align="center">
  <img src="src/assets/brand/hooksmith-logo.png" alt="Hooksmith Logo" width="380">
</p>

<p align="center">
  <strong>Local API & Webhook Forge — 100% Offline, Privacy-First Developer Hub</strong>
</p>

<p align="center">
  <a href="README.pt-BR.md">🇧🇷 Versão em Português</a> •
  <a href="README.md">🇺🇸 English Version</a>
</p>

---

## ☕ The Origin: Built by Devs, for Devs

If you have ever built an integration with a payment gateway, an ERP, or a third-party webhook provider, you know the struggle:

- **The WireMock Dilemma:** Writing verbose Java code, fighting through endless nested JSON mapping files, spinning up heavy Docker containers just to return a simple `200 OK`, or debugging why a standalone mock server didn't match a specific regex.
- **The Webhook Blindness:** Staring at terminal logs, hoping a webhook hit your application, with zero visibility into whether the request arrived, if headers were stripped, or what raw body was received.
- **The Asynchronous Nightmare:** How do you test a gateway that answers your checkout with an immediate `200 OK` and then fires a webhook callback 3 seconds later? You end up writing throwaway scripts, fake controllers, or manually triggering Postman requests just to verify your database state.
- **The Cloud Tunnel Tax:** Relying on tools with rotating public URLs, bandwidth caps, network latency, and sending sensitive customer data through external third-party servers.

**Hooksmith was born from this exact frustration.**

We wanted a visual, instant, desktop-native forge where you can open an HTTP or HTTPS port in seconds, see every byte of traffic in real time, tweak payloads on the fly, and simulate full-blown asynchronous webhook lifecycles with zero friction. No cloud dependencies, no Docker overhead, no complex config files. Just an intuitive, rock-solid forge designed by developers who have spent countless late nights debugging webhooks.

---

## 📌 What is Hooksmith?

**Hooksmith** is an ultra-fast, desktop-native developer tool designed to intercept, inspect, test, mock, and replay HTTP and HTTPS webhooks and API calls entirely on your local machine.

Unlike cloud-dependent webhook testing tools, Hooksmith runs **100% locally**. No accounts, no subscriptions, no third-party cloud relays, and zero telemetry. All captured data, mock rules, and self-signed certificates stay safely on your local disk.

---

## 🚀 Key Capabilities

- **Multi-Port Listeners (HTTP & HTTPS/SSL):** Spawn local servers on custom ports with built-in, automated zero-config SSL certificates.
- **Real-Time Traffic Inspection:** High-resolution stream displaying every incoming request, duration, response code, and exact timestamp.
- **Split-View Resizable Inspector:** Monaco-powered payload viewer with adjustable split-height between Request and Response.
- **Smart JSON Prettify:** Instant toggle between pretty-printed JSON and raw/minified format with 1-click clipboard copy.
- **Flexible Mock Engine:** Intercept requests matching method/path with custom status codes, headers, and simulated network latency.
- **Automated Asynchronous Callbacks:** Trigger automatic webhook callbacks (e.g., simulating payment gateways firing an asynchronous confirmation event to your backend).
- **Edit & Replay:** Modify captured headers or payloads and re-fire requests in a single click.
- **Multilingual UI:** Complete interface available in English, Portuguese (pt-BR), and Spanish (es-ES).

---

## 📖 User Manual & Walkthrough

### 1. Managing Listeners (HTTP & HTTPS)

Listeners are the local ports Hooksmith opens on your computer to receive incoming traffic from your backend services, microservices, or external tools.

1. In the left sidebar under **Listeners**, click **`+`** (or press the **`+ Listener`** button in the top bar).
2. Configure your listener:
   - **Name:** A friendly label (e.g., `Payment Gateway`, `Billing Service`, `Webhook Receiver`).
   - **Port:** Port number (e.g., `4010`, `8443`, `8080`).
   - **HTTPS / SSL:** Toggle on to enable secure HTTPS listening. Hooksmith will automatically issue and manage a local self-signed certificate.
3. Click **Start Listener**. The listener will immediately go live (indicated by the green pulse badge).
4. Use the toggle button on any listener card to quickly pause or resume it without losing your configuration.

---

### 2. Monitoring Live Traffic

Whenever an HTTP/HTTPS request hits an active port, it appears instantly in the central **Live Traffic** column:

- **Quick Badges:** Identifies the HTTP method (`POST`, `GET`, `PUT`, `DELETE`), endpoint path, response status (`200 OK`, `500 Internal Server Error`, etc.), execution time in milliseconds, and port number.
- **Traffic Origin Tags:**
  - `CAPTURED`: Live incoming request intercepted by a listener.
  - `MOCKED`: Request answered by a local Hooksmith mock rule.
  - `REPLAY`: Request re-sent from the Hooksmith Replay engine.
  - `CALLBACK`: Automatic callback fired by a mock rule.
- **Search & Filtering:**
  - Use the top search bar (<kbd>Ctrl</kbd> + <kbd>K</kbd>) to search by path, body contents, or status.
  - Filter traffic by clicking tabs: **All**, **POST**, **GET**, or **Errors** (4xx/5xx).
  - Clear the stream at any time using the **Clear** button.

---

### 3. Inspecting Requests and Responses

Clicking any captured request in the central column loads its full diagnostics into the **Inspection Panel**:

- **Date & Exact Timestamp:** Displays the date and time (`DD/MM/YYYY HH:MM:SS`) when the request arrived.
- **Monaco Code Editor:** Full syntax highlighting and code folding for JSON, XML, HTML, and Plaintext payloads.
- **Adjustable Request/Response Split:**
  - Hover over the horizontal divider separating the Request (top) and Response (bottom).
  - Click and drag up or down to give more room to the Request or Response payload.
  - **Double-click** the divider to restore the balanced 50% / 50% view.
  - Your preferred split height is automatically saved for future sessions.
- **JSON Prettify Toggle:**
  - Located on the tab toolbar next to the language indicator.
  - Click **`Pretty`** to toggle between clean 2-space formatted indentation and raw single-line minified JSON.
- **Tabs:**
  - **Body:** Formatted payload with search and copy tools.
  - **Headers:** Parsed key-value table of HTTP headers.
  - **Query:** Parsed query-string parameters.
  - **Raw:** Exact raw payload wire-format.

---

### 4. Creating & Inspecting Mock Rules

Mock rules let you simulate third-party endpoints or backend responses without writing mock server code:

1. Click **`+`** on **Mock Rules** in the sidebar (or press <kbd>Ctrl</kbd> + <kbd>M</kbd>).
2. Configure:
   - **Rule Name:** e.g., `Simulate Payment Timeout (504)`.
   - **Scope:** Apply to all ports or bind exclusively to a specific listener port (with visual **`SSL`** badge indicators for HTTPS ports).
   - **HTTP Method & Path:** Matching criteria (e.g., `POST` `/api/v1/checkout` or wildcards).
   - **Status Code:** Standard (`200`, `201`, `400`, `404`, `500`, etc.) or custom status code.
   - **Simulated Delay (ms):** Add realistic network latency (e.g., `800ms`) to test UI loading states and backend timeouts.
   - **Response Body & Headers:** Define the simulated payload returned to the caller.
3. **Inspecting vs Editing Mocks:**
   - **Clicking a Mock Card:** Selects the rule and opens the read-only **Mock Inspector** in the right column. You can view the route, status, headers, body, cURL test command, and callback settings.
   - **Editing a Mock Rule:** Click the **Pencil icon** on the card (visible on hover) or click the **Edit Rule** button inside the Mock Inspector.

---

### 5. Automated Asynchronous Webhook Callbacks

Many production webhook architectures (such as Stripe, PayPal, MercadoPago, GitHub, or WhatsApp APIs) work asynchronously:
1. You make an initial API call (e.g., create order).
2. The service acknowledges with `200 OK`.
3. Seconds later, their server sends a webhook callback to your notification URL (e.g., `payment.succeeded`).

Hooksmith supports this workflow directly inside mock rules:

1. In the **Mock Editor Modal**, scroll to the **Asynchronous Callback** section and toggle it on.
2. Provide:
   - **Callback Method:** `POST`, `PUT`, `PATCH`, or `GET`.
   - **Target URL:** Your application endpoint (e.g., `http://localhost:3000/api/webhooks/orders`).
   - **Callback Delay:** Wait time in milliseconds after the mock responds before firing the callback (e.g., `2000ms`).
   - **Callback Payload:** The JSON notification payload that will be delivered to your target service.
3. When any caller hits this mock rule, Hooksmith responds immediately with the mock response, waits the specified delay, and executes the HTTP callback automatically.

---

### 6. Edit & Replay

Need to tweak a webhook payload and re-send it to test your backend handler?

1. Select any captured request in the traffic list.
2. In the top action bar of the inspector, click **`Edit & Replay`**.
3. The editor activates **Edit Mode**:
   - Edit the payload in the Monaco editor.
   - Adjust request headers as needed.
   - Click the orange **`Replay`** button (or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
4. The forged request is fired immediately, and its execution result appears at the top of the traffic stream with the `REPLAY` origin tag.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Fire Replay of the selected request |
| <kbd>Ctrl</kbd> + <kbd>M</kbd> | Open New Mock Rule modal |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>E</kbd> | Focus global search bar |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | Clear captured traffic stream |
| <kbd>Esc</kbd> | Close active modal or deselect inspection |
| <kbd>Ctrl</kbd> + <kbd>+</kbd> / <kbd>Ctrl</kbd> + <kbd>-</kbd> | Zoom in / Zoom out application UI |
| <kbd>Ctrl</kbd> + <kbd>0</kbd> | Reset application zoom |

---

## 🔒 Privacy & Local Storage

Hooksmith stores all data in a local SQLite database on your machine:
- **Windows:** `%APPDATA%/Hooksmith/hooksmith.db`
- **macOS:** `~/Library/Application Support/Hooksmith/hooksmith.db`
- **Linux:** `~/.config/Hooksmith/hooksmith.db`

No telemetry, analytics, or external network requests are ever made by the core application.

---

## 📄 License

Hooksmith is distributed under the [MIT License](LICENSE).
