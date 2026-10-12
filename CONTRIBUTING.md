# Contributing to OpenTask

Thank you for your interest in contributing to **OpenTask**! OpenTask is an open-source task management application built for learning and demonstrating modern full-stack open-source software (OSS) development practices.

We welcome contributions from everyone, especially students and beginners in open source.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all contributors with respect, courtesy, and encouragement.

---

## Table of Contents

1. [How to Contribute](#how-to-contribute)
2. [Getting Started (Fork & Clone)](#getting-started-fork--clone)
3. [Branch Naming Convention](#branch-naming-convention)
4. [Local Development Setup](#local-development-setup)
5. [Running Tests](#running-tests)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Reporting Bugs](#reporting-bugs)
9. [Suggesting Features](#suggesting-features)
10. [Coding Style & Standards](#coding-style--standards)

---

## How to Contribute

You can contribute in several ways:
- **Reporting Bugs**: Let us know if something isn't working as expected.
- **Suggesting Features**: Propose new capabilities that enhance usability.
- **Documentation**: Fix typos, add explanations, or clarify instructions.
- **Code Changes**: Implement bug fixes, new features, or automated tests.

---

## Getting Started (Fork & Clone)

### Step 1: Fork the Repository
Click the **Fork** button at the top right of the [OpenTask Repository](https://github.com/saheena-si/opentask-oss-lab) to create a copy under your GitHub account.

### Step 2: Clone Your Fork
Clone your fork to your local machine:

```bash
git clone https://github.com/<your-username>/opentask-oss-lab.git
cd opentask-oss-lab
```

### Step 3: Set Up Upstream Remote
Keep your fork synchronized with the original repository:

```bash
git remote add upstream https://github.com/saheena-si/opentask-oss-lab.git
git fetch upstream
```

---

## Branch Naming Convention

Always create a new branch from `main` before making changes. Use descriptive prefixes:

| Branch Type | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality or user-facing changes | `feature/due-date-reminders` |
| `fix/` | Bug fixes or issue resolution | `fix/task-filter-empty-state` |
| `docs/` | Documentation improvements or guides | `docs/add-troubleshooting-section` |
| `test/` | Adding or improving automated test suites | `test/add-validation-tests` |
| `refactor/` | Code structure improvements with no behavior change | `refactor/extract-api-utils` |

Create and switch to your branch:

```bash
git checkout -b feature/your-feature-name
```

---

## Local Development Setup

### Prerequisites
- **Node.js**: v20 or v24+ (Node.js 24 recommended)
- **npm**: v10+ or v11+
- **Git**: v2.30+

### Install Dependencies

From the project root:

```bash
npm run install:all
```

Or install backend and frontend dependencies individually:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Running Backend and Frontend

Run them in **two separate terminal windows**:

#### Terminal 1 — Backend (Port 5000)
```bash
cd backend
npm run dev
```
The backend initializes the SQLite database at `backend/data/opentask.db` and loads initial demo tasks safely.

#### Terminal 2 — Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running Tests

Before committing or pushing any code, verify that all test suites pass:

```bash
# Run backend test suite from root
npm test

# Or directly in the backend folder
cd backend
npm test
```

Verify frontend build passes without errors:

```bash
cd frontend
npm run build
```

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) convention to keep the Git history readable and beginner-friendly:

- `feat: add export tasks to CSV option`
- `fix: prevent duplicate tasks on filter reset`
- `docs: update setup instructions in README`
- `test: add test case for invalid task priority`
- `style: format modal buttons with consistent padding`

---

## Submitting a Pull Request

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: descriptive summary of your changes"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request**:
   - Navigate to `https://github.com/saheena-si/opentask-oss-lab`.
   - Click **Compare & pull request**.
   - Fill in the PR template with summary, linked issues, and testing steps.
   - Wait for automated GitHub Actions CI checks to pass.

---

## Reporting Bugs

Before reporting a bug, search existing [GitHub Issues](https://github.com/saheena-si/opentask-oss-lab/issues) to ensure it hasn't already been reported.

If it's new:
1. Open a new issue using the **Bug Report** template.
2. Provide step-by-step reproduction instructions.
3. Include expected vs. actual behavior.
4. Mention your browser and operating system.

---

## Suggesting Features

We welcome ideas for improving OpenTask!
1. Open a new issue using the **Feature Request** template.
2. Clearly explain the problem the feature solves.
3. Describe the proposed solution and user experience.
4. Outline potential acceptance criteria.

---

## Coding Style & Standards

- **JavaScript**: Use modern ES6+ syntax (`const`/`let`, arrow functions, async/await).
- **Backend**: Use parameterized SQL queries (`?`) for all database operations to prevent SQL injection.
- **Frontend**: Keep components small, focused, and accessible with semantic HTML and ARIA labels.
- **Secrets**: Never commit `.env` files or sensitive credentials. Use `.env.example` templates.
- **Database**: Do not commit SQLite `.db` binary files.
