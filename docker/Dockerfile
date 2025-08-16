# Playwright + Allure runner
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

WORKDIR /app

# Copy package.json first for caching layer
COPY package.json package-lock.json* ./

RUN npm ci --no-audit --no-fund

# Copy the full project into container
COPY . .

# Install browsers (already present in base, but ensure deps)
RUN npx playwright install --with-deps

# ENV for container to reach host service
ENV BASE_URL=${BASE_URL:-http://host.docker.internal:8000}
ENV UPLOAD_STATUS_PATH=${UPLOAD_STATUS_PATH:-/documents/upload}
ENV CI=true

# Default command runs tests then generates allure report
CMD npm run test:all && npm run allure:generate