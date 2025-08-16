# Playwright + Allure runner
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY . .

# Install browsers (already present in base, but ensure deps)
RUN npx playwright install --with-deps

# ENV for container to reach host service
ENV BASE_URL=${BASE_URL:-http://host.docker.internal:8000}

# Default command runs tests then generates allure
CMD npm run test:all && npm run allure:generate
