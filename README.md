# DevOps Practical App

[![CI Pipeline](https://github.com/Jehanfernando02/devops-practical/actions/workflows/ci.yml/badge.svg)](https://github.com/Jehanfernando02/devops-practical/actions/workflows/ci.yml)
[![PHP](https://img.shields.io/badge/PHP-8.4-blue?logo=php)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-11-red?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://docker.com)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-d33833?logo=jenkins)](https://jenkins.io)

**Live:** http://51.20.252.1/

A production-style full-stack application built end-to-end to demonstrate real DevOps practices — containerisation, automated CI/CD pipelines, automated testing, health monitoring, and Python scripting.

---

## Architecture

```
                         ┌─────────────────────────────────────┐
         Internet        │         Docker Compose Stack         │
        ──────────►  :80 │                                      │
                         │  ┌──────────┐    ┌───────────────┐  │
                         │  │  Nginx   │───►│  Laravel App  │  │
                         │  │ (Alpine) │    │  (PHP-FPM)    │  │
                         │  └──────────┘    └───────┬───────┘  │
                         │       │                  │          │
                         │       ▼                  ▼          │
                         │  ┌──────────┐    ┌───────────────┐  │
                         │  │  React   │    │  MySQL 8.0    │  │
                         │  │ Frontend │    │  (with health │  │
                         │  │  (Nginx) │    │   check)      │  │
                         │  └──────────┘    └───────────────┘  │
                         └─────────────────────────────────────┘

                    app-network (bridge) — all containers on one network

CI/CD Flow:
  Push to GitHub
      │
      ├──► GitHub Actions (runs immediately)
      │       ├─ Backend Tests (PHP/MySQL service container)
      │       ├─ Frontend Lint + Build
      │       └─ Docker Build Validation
      │
      └──► Jenkins Webhook Trigger (deploys to EC2)
              ├─ Checkout latest code
              ├─ Run PHPUnit tests in isolated container
              ├─ docker compose build + up -d
              ├─ php artisan migrate / config:cache
              └─ Health check: curl /api/health
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.4 · Laravel 11 · Laravel Sanctum |
| Frontend | React 19 · TypeScript · Vite · Tailwind CSS |
| Database | MySQL 8.0 |
| Web Server | Nginx (Alpine) |
| Containerisation | Docker · Docker Compose |
| CI/CD | Jenkins (Declarative Pipeline) · GitHub Actions |
| Scripting | Python 3 (health monitoring) |
| Hosting | AWS EC2 (Ubuntu) |

---

## DevOps Skills Demonstrated

| Skill | Implementation |
|---|---|
| **CI/CD Pipelines** | Jenkins declarative pipeline (`Jenkinsfile`) + GitHub Actions (`.github/workflows/ci.yml`) |
| **Containerisation** | Multi-service Docker Compose with health checks, named volumes, and a custom network |
| **Infrastructure** | App running on AWS EC2, auto-deployed via Jenkins webhook on every push to `master` |
| **Automated Testing** | 7 PHPUnit feature tests run inside an isolated Docker container with SQLite in-memory DB |
| **Health Monitoring** | `/api/health` endpoint returning DB status + environment; Python script for polling |
| **Python Scripting** | `scripts/health_check.py` — polls the health endpoint, logs response times, exits 1 in CI |
| **Groovy / Pipeline DSL** | Jenkinsfile with `triggers{}`, `options{}`, `timestamps()`, `buildDiscarder`, webhook trigger |
| **Nginx** | Reverse proxy routing `/api/*` to PHP-FPM, serving React SPA for all other routes |
| **Git Workflow** | GitHub → webhook → Jenkins → EC2 auto-deploy on every push |

---

## Features

- Full **CRUD** for Posts (Create, Read, Update, Delete)
- RESTful JSON API with Laravel validation and proper HTTP status codes
- React SPA with a professional DevOps-themed dark dashboard UI
- Interactive CI/CD Pipeline visualiser page (see how the pipeline works in the browser)
- `/api/health` endpoint — returns DB connectivity status, environment, version
- Python health monitoring script with watch mode and log output
- Docker Compose multi-service setup with dependency health checks
- Automated PHPUnit tests run inside Docker (no host PHP required)

---

## Project Structure

```
.
├── .github/workflows/ci.yml     ← GitHub Actions CI pipeline
├── app/
│   ├── Http/Controllers/Api/PostController.php
│   └── Models/Post.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── frontend/                    ← React 19 + TypeScript SPA
│   ├── src/
│   │   ├── pages/PostsList.tsx  ← CRUD dashboard
│   │   ├── pages/Pipeline.tsx   ← CI/CD visualiser
│   │   └── api/client.ts
│   └── Dockerfile
├── jenkins/Dockerfile           ← Custom Jenkins image (Docker-in-Docker)
├── nginx/default.conf           ← Nginx reverse proxy config
├── scripts/health_check.py      ← Python monitoring script
├── routes/api.php               ← REST API + /api/health endpoint
├── tests/Feature/PostApiTest.php ← 7 PHPUnit feature tests
├── docker-compose.yml           ← 4-service stack
├── Dockerfile                   ← PHP 8.4-FPM backend image
└── Jenkinsfile                  ← Declarative CI/CD pipeline (Groovy)
```

---

## Getting Started

### Prerequisites
- [Docker](https://docker.com) and Docker Compose
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Jehanfernando02/devops-practical.git
cd devops-practical
```

### 2. Start all services

```bash
docker compose up -d --build
```

Four containers start:

| Container | Description | Port |
|---|---|---|
| `devops-test-app` | Laravel PHP-FPM | — |
| `devops-test-nginx` | Nginx reverse proxy | `80` |
| `devops-test-frontend` | React SPA | — |
| `devops-test-db` | MySQL 8.0 | — |

### 3. Run migrations

```bash
docker compose exec app php artisan migrate --seed
```

### 4. Open the app

| Service | URL |
|---|---|
| App | http://localhost |
| API | http://localhost/api |
| Health | http://localhost/api/health |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check (DB status, version) |
| `GET` | `/api/posts` | List all posts |
| `POST` | `/api/posts` | Create a post |
| `GET` | `/api/posts/{id}` | Get a post |
| `PUT` | `/api/posts/{id}` | Update a post |
| `DELETE` | `/api/posts/{id}` | Delete a post |

---

## Running Tests

```bash
# Inside Docker (same as CI pipeline)
docker compose exec app php artisan test

# Or in the GitHub Actions pipeline (automatic on every push)
```

---

## Python Health Monitor

```bash
# Single check (exits 1 if unhealthy — useful in scripts/CI)
python3 scripts/health_check.py

# Watch mode — polls every 30 seconds
python3 scripts/health_check.py --watch --interval 30

# Check a different URL
python3 scripts/health_check.py --url http://51.20.252.1/api/health
```

No `pip install` required — uses Python stdlib only.

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

Triggered on every push to `master` / every Pull Request:

1. **Backend Tests** — PHP 8.4, MySQL service container, `php artisan test`
2. **Frontend Build** — Node 20, `npm ci`, ESLint, `npm run build`
3. **Docker Build Check** — validates both Dockerfiles compile

### Jenkins (EC2 — `Jenkinsfile`)

Triggered by **GitHub webhook** on every push to `master`:

1. `Checkout` — pulls latest code
2. `Backend Tests` — builds test image, runs PHPUnit in isolation
3. `Deploy` — `docker compose build` → `up -d` → migrations → config cache
4. `Cleanup` — prunes dangling images

---

## Fixing Auto-Deploy (GitHub Webhook → Jenkins)

If the EC2 deployment doesn't update automatically after a push:

1. In Jenkins: job → **Configure** → **Build Triggers** → ✅ **GitHub hook trigger for GITScm polling**
2. In GitHub: repo → **Settings** → **Webhooks** → **Add webhook**
   - Payload URL: `http://<JENKINS_IP>:8080/github-webhook/`
   - Content type: `application/json`
   - Events: **Just the push event**

---

## Useful Commands

```bash
docker compose ps                          # list running containers
docker compose logs -f app                 # tail Laravel logs
docker compose exec app php artisan <cmd>  # run artisan commands
docker compose down                        # stop everything
docker compose down -v                     # stop + wipe volumes

python3 scripts/health_check.py --watch    # monitor live deployment
curl http://51.20.252.1/api/health         # quick health check
```

---

## License

MIT
