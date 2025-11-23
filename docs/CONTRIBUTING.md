# Contributing to Lily Cloud Web

This document provides guidelines and instructions for setting up your development environment and contributing to the Lily Cloud Web project.

## Prerequisites

- [Node.js](https://nodejs.org/): Latest version.
- [pnpm](https://pnpm.io/): Package manager, can be installed using `npm install -g pnpm`.
- [Git](https://git-scm.com/): For version control.

## Getting Started

### 1. Clone the Repository

Via ssh (recommended):

```bash
git clone git@github.com:LilyCloudRust/LilyCloudWeb.git
cd LilyCloudWeb
```

Via https:

```bash
git clone https://github.com/LilyCloudRust/LilyCloudWeb.git
cd LilyCloudWeb
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Useful Commands

- `pnpm start`: Start the development server.
- `pnpm dev`: Start the development server.
- `pnpm build`: Build the project for production.
- `pnpm serve`: Run the production server.
- `pnpm format`: Format the codebase.
- `pnpm lint`: Run linting and apply fixes.
- `pnpm prepare`: Prepare Husky hooks.

### 4. Code Quality and Pre-commit Hooks

We enforce code quality using Husky and lint-staged. To set up the pre-commit hooks, run:

```bash
pnpm prepare
```

Note: Pre-commit hooks will automatically run formatter and linter on staged files and try to fix issues before committing. If there are unfixable issues, the commit will be aborted. You can run the pre-commit hooks manually with:

```bash
pnpm exec lint-staged
```

Or if you want to run code quality checks on the entire codebase:

```bash
pnpm format
pnpm lint
```
