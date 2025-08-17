# 🚀 RAG E2E Test Pipeline (Playwright + Allure + Docker)

This repository provides a **production-grade end-to-end (E2E) testing pipeline** for a **RAG (Retrieval-Augmented Generation) application**, powered by **Playwright**, **TypeScript**, **Allure reporting**, **Docker**, and **GitHub Actions CI/CD**.

By default, the Application Under Test (AUT) is expected to run at **http://localhost:8000**.

---

## ✨ Features

- ✅ **Playwright + TypeScript**: Modern, fast, and reliable cross-browser testing framework.
- 📂 **File Upload Testing**: Covers single, multiple, and large (50MB+) file uploads.
- 🕵️ **UI + API Validation**: Verifies progress indicators.
- 💬 **Chat Interaction Checks**: Ensures readiness, disables Ask button until input, verifies RAG-based answers.
- 🔎 **Grounded Assertions**: Soft keyword matching for flexible yet robust validation.
- 📡 **WebSocket Streaming Validation**: Bonus test for streaming responses.
- 📊 **Allure Reports**: Interactive test analytics with history, screenshots, videos, and traces.
- 🐳 **Dockerized Pipeline**: Encapsulates browsers, Node.js, and Allure CLI.
- ⚙️ **GitHub Actions CI**: Automated testing in pipelines with report artifacts.

---

## 🔑 Benefits of Each Component

- **Playwright** → Reliable cross-browser automation, rich API (file uploads, WebSockets, tracing).
- **Configuration (`playwright.config.ts`)** → Centralized setup for retries, reporters, timeouts, device emulation.
- **Allure** → Professional reports with timelines, steps, screenshots, and video debugging.
- **Docker** → Reproducible test environments, CI/CD friendly, eliminates "works on my machine" issues.
- **GitHub Actions** → Automated runs on every commit/PR, visibility with reports and artifacts.

---

## ⚡ Prerequisites

- AUT running at `http://localhost:8000` (front-end + back-end ready).
- Node.js `>=18` (if running locally).
- For Docker:
  - On **Linux** → Use `network_mode: host`.
  - On **macOS/Windows** → Use `host.docker.internal`.

---

## 🚀 Quick Start (Local)

```bash
npm ci
cp .env.example .env        # adjust BASE_URL or API endpoints if needed
npm run test:all            # run all tests
npm run allure:generate
npm run allure:open
```

---

## 🐳 Running in Docker

The provided **Dockerfile** and **docker-compose.yml** encapsulate Node.js, Playwright browsers, and Allure CLI.

### One-shot build & run with compose

```bash
cd docker
docker compose up --build --abort-on-container-exit
```

- Linux: `BASE_URL=http://localhost:8000`
- macOS/Windows: `BASE_URL=http://host.docker.internal:8000`

### Direct Docker build

```bash
docker build -t MohamedSaidE2e -f docker/Dockerfile .
docker run --rm --network host -e BASE_URL=http://127.0.0.1:8000 MohamedSaidE2e
```

Generated reports will be available under `allure-report/`.

---

## 🧪 Test Structure

- `tests/1.upload.spec.ts` → File upload (single/multiple) with progress checks.
- `tests/2.upload-large-file.spec.ts` → Stress test with >50MB file uploads.
- `tests/3.error-cases.spec.ts` → Input disablement, invalid/unsupported file handling.
- `tests/4.chat.spec.ts` → Chat input readiness, Ask button behavior, bot response.
- `tests/5.rag-questions.spec.ts` → 5+ RAG-grounded Q\&A validations.
- `tests/6.websocket.spec.ts` → WebSocket message capture during streaming.

### Supporting Files

- `playwright.config.ts` → Central config (timeouts, reporters, retries, devices).
- `utils/selectors.ts` → Central selectors for maintainability.
- `utils/helpers.ts` → Upload waiters, reusable utilities.
- `fixtures/test-data.ts` → Predefined RAG questions and expected keywords.
- `resources/` → Sample documents (`sample1.txt`, `sample2.txt`, large test file).

---

## 📡 API & WebSocket Notes

- Default status polling endpoint: `/documents/upload`.
- Override with `UPLOAD_STATUS_PATH` env var if different.
- WebSocket checks use Playwright’s native event API.

---

## ⚙️ CI/CD with GitHub Actions

- Workflow defined in `.github/workflows/github.yml`.
- Assumes AUT is accessible from runner (or started in another job).
- `BASE_URL` can be set via repo secrets or env vars.
- Generates and uploads Allure report as CI artifact.

---

## ✅ Advantages

- 🔒 **Deterministic & Portable** — Docker eliminates environment mismatches.
- 📈 **Rich Reporting** — Allure improves debugging with visual context.
- 🧩 **Scalable & Modular** — Organized tests, selectors, and helpers.
- ⚡ **Fast Feedback Loop** — Playwright + GitHub Actions enable quick regression checks.

---

## ⚠️ Trade-offs

- 🌐 **API Guesswork** — Status polling assumes `/documents/upload` unless overridden.
- 📝 **Keyword Matching** — For strict semantic checks, consider golden answers or embeddings.
- 🔧 **Host Networking** — `network_mode: host` eases Linux setup but reduces portability.

---

## 🔍 Verify Docker Image

```sh
docker images | grep rag_e2e_test_pipeline
```

You should see:

```
rag_e2e_test_pipeline    latest    <IMAGE_ID>   <CREATED_AT>   <SIZE>
```

# Founded Bugs:


## 🐞 Bug Report 1: Chatbot “Ask Question” Button Enabled But No Response Returned

**Summary:**
The chatbot interface allows sending questions after typing, but no bot responses are received. This causes multiple test failures across both Chromium and Firefox.

**Steps to Reproduce:**

1. Navigate to chat page.
2. Type a valid question in the text area.
3. Click the “Ask Question” button.
4. Wait for a response.

**Expected Result:**
The chatbot should process the request and display a visible response in the chat window.

**Actual Result:**

- The “Ask Question” button enables and sends the message.
- No response message appears from the bot within the timeout.
- Logs show repeated failures:
  - `Timed out 60000ms waiting for expect(locator).toBeVisible()`
  - `[data-testid="msg-bot"], .message.bot, .bubble.bot not found`.

  **Severity:**
  - Critical
  
  **Priority:**
  - 1

---

## 🐞 Bug Report 2: Process File Functionality Not Working

**Summary:**
The _Process File_ button is visible but clicking it does not trigger any file processing action, causing test failures.

**Steps to Reproduce:**

1. Upload a valid file (e.g., `sample1.txt`).
2. Wait for the file to be listed in the UI.
3. Click the `Process file` button beside the uploaded file.

**Expected Result:**
The system should start processing the uploaded file and provide a progress indicator, followed by a confirmation (e.g., “File processed successfully”).

**Actual Result:**
Clicking the `Process file` button times out — no visible progress or confirmation occurs.

- Logs show: `TimeoutError: locator.click: Timeout 30000ms exceeded`.


  **Severity:**
  - High
  
  **Priority:**
  - 1

---

## 🐞 Bug Report 3: System Does Not Support Uploading Multiple Files at Once

**Summary:**
The file input field is configured for single file uploads only. When multiple files are attempted, uploads fail in Chromium and Firefox.

**Steps to Reproduce:**

1. Navigate to the upload page.
2. Select multiple files (e.g., `sample1.txt`, `sample2.txt`) for upload.
3. Submit the upload.

**Expected Result:**
The system should accept multiple files in one action, display all in the UI, and track upload progress for each.

**Actual Result:**
Upload fails with the error:

```
locator.setInputFiles: Error: Non-multiple file input can only accept single file
```

  **Severity:**
  - Medium
  
  **Priority:**
  - 2

---

## 🐞 Bug Report 4: Certain File Types Not Accepted (.png, .docx)

**Summary:**
When uploading `.png` or `.docx` files, the system either rejects the upload or fails silently, blocking analysis of potentially valuable content.

**Steps to Reproduce:**

1. Open the file upload form.
2. Attempt to upload a `.png` or `.docx` file.
3. Observe behavior in UI.

**Expected Result:**
The system should accept supported file types. If these formats are unsupported by business rules, a **clear validation error message** should appear.

**Actual Result:**

- Upload either fails silently or rejects without meaningful feedback.
- Users cannot analyze these file types.

  **Severity:**
  -  Medium
  
  **Priority:**
  - 3

---


✅ These are now documented as **Allure Product Defects** for your reporting flow.

---


```
👨‍💻 Maintained by **Mohamed Said Ibrahim** · Cypress Ambassador

```
