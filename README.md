# RAG E2E Test Pipeline (Playwright + Allure + Docker)

This repository provides a production-grade end‑to‑end test suite and Dockerized pipeline for a RAG (Retrieval‑Augmented Generation) application running at **http://localhost:8000** by default.

## Features

- Playwright (as requested), TypeScript.
- File upload tests (single & multiple) using selector `input[type="file"]`.
- UI progress + optional API polling to verify upload completion.
- Chat readiness checks (textarea + disabled Ask button until input).
- 5+ RAG‑grounded questions with soft‑keyword relevance assertions.
- Error‑handling tests, UI responsiveness checks.
- **Bonus:** WebSocket streaming verification.
- **Allure** reporting integrated.
- Dockerfile + docker‑compose to run tests in containers.
- Optional GitHub Actions CI workflow.

---

## Prerequisites

- AUT (Application Under Test) running locally at `http://localhost:8000` (front‑end + back‑end up).
- Node.js 18+ (or use Docker only).
- If running via Docker and reaching a host service, ensure `host.docker.internal` resolves, or use `network_mode: host` on Linux.

## Quick Start (Local)

```bash
npm ci
cp .env.example .env        # adjust if needed
npm run test:all            # run all tests
npm run allure:generate
npm run allure:open
```

## Running in Docker

The Docker image encapsulates Node, Playwright browsers, and Allure CLI.

### One‑shot build & run with compose

```bash
cd docker
docker compose up --build --abort-on-container-exit
```

- Uses `network_mode: host` so the container can reach your AUT at `http://localhost:8000` on Linux.
- Override the base URL if needed:
  - macOS/Windows: `BASE_URL=http://host.docker.internal:8000`
  - Linux bridge: `BASE_URL=http://172.17.0.1:8000`

### Direct Docker build (without compose)

```bash
docker build -t rag-e2e -f docker/Dockerfile .
docker run --rm --network host -e BASE_URL=http://127.0.0.1:8000 rag-e2e
```

Generated reports will be in `allure-report/` inside the project (mounted in compose).

## Test Structure

- `tests/upload.spec.ts` — Single & multiple file upload, progress checks, optional API verification.
- `tests/chat.spec.ts` — Chat textarea appears; "Ask Question" is disabled until text; basic bot response.
- `tests/rag-questions.spec.ts` — 5 grounded questions validated via soft keyword matches.
- `tests/error-cases.spec.ts` — Empty question disablement; unsupported file error (if enforced by AUT).
- `tests/websocket.spec.ts` — Bonus: captures WS frames during response streaming.

### Config & Helpers

- `playwright.config.ts` — Reporter: list + `allure-playwright` + HTML; trace/screenshot/video on failures.
- `utils/selectors.ts` — Central selectors (resilient fallbacks included).
- `utils/helpers.ts` — Upload completion waiters + (optional) API status polling.
- `fixtures/test-data.ts` — The 5+ questions and expected soft keywords.
- `resources/` — Sample test documents: `sample1.txt`, `sample2.txt`.

## API & WebSocket Notes

- Status polling endpoint defaults to "/documents/upload" and can be overridden via env var `UPLOAD_STATUS_PATH`.
- If your AUT exposes a different API, set `UPLOAD_STATUS_PATH` accordingly or rely solely on UI progress checks.
- WebSocket capture relies on Playwright's `page.on("websocket")` and `framereceived` event.

## CI/CD

A minimal GitHub Actions workflow is included in `.github/workflows/github.yml`.

- Assumes the AUT is reachable by the runner (e.g., started in a separate job/service). Set `BASE_URL` in workflow env or repository secrets.
- Uploads the generated Allure report as a build artifact.

## Advantages of this Approach

- **Deterministic & Portable:** Docker encapsulates browsers and dependencies.
- **Grounded Assertions:** Soft keyword checks reduce brittleness while ensuring relevance.
- **Scalable:** Organized selectors/helpers; easy to add tests.
- **Rich Reporting:** Allure provides actionable test analytics and history (when persisted).

## Disadvantages / Trade‑offs

- **Endpoint Guessing:** Without fixed API contracts, status polling uses a configurable default or UI heuristics.
- **Keyword‑based Relevance:** For strict semantic checks, integrate golden answers or embeddings‑based validators.
- **Network‑mode Host:** On Linux, using `network_mode: host` simplifies connectivity but is less portable than explicit bridges.
