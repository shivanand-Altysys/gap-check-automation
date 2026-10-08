# gap-check-automation

TypeScript + Playwright + Cucumber automation suite for the Gap Check application.

## Overview

This repository contains end-to-end UI automation tests for login, forgot password, signup, and admin flows using Playwright and Cucumber BDD.

## Tech Stack

- Node.js 20+
- TypeScript
- Playwright
- CucumberJS
- Faker
- dotenv

## Getting Started

```bash
npm install
npx playwright install
```

## Running Tests

```bash
npm run typecheck
npm run test:tag -- "@LOGIN_TC_002 or @LOGIN_TC_003 or @LOGIN_TC_004 or @LOGIN_TC_005 or @LOGIN_TC_006" features/ui/admin/login.feature
```

## CI

This project runs automated checks via GitHub Actions on push and pull request.

## Repository

- GitHub: https://github.com/shivanand-Altysys/gap-check-automation
