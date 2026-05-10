# DevOps Test App

public ip address : http://51.20.252.1/

A full-stack CRUD application built with **Laravel 11** (REST API) and **React + TypeScript** (frontend), fully containerised with Docker Compose.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.x · Laravel 11 · Laravel Sanctum |
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS |
| Database | MySQL 8.0 |
| Web Server | Nginx (Alpine) |
| Containerisation | Docker · Docker Compose |

---

## Features

- Full **CRUD** for Posts (Create, Read, Update, Delete)
- RESTful JSON API with Laravel validation and proper HTTP status codes
- React SPA with client-side routing via React Router
- Axios API client with TypeScript types
- Form validation with inline error display
- Database-backed sessions, cache, and queues
- Laravel Sanctum configured for SPA authentication
- Docker Compose multi-service setup with health checks

---

## Project Structure

```
.
├── app/
│   ├── Http/Controllers/Api/PostController.php
│   ├── Models/Post.php
│   └── Models/User.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── frontend/
│   ├── src/
│   │   ├── api/client.ts
│   │   ├── components/PostForm.tsx
│   │   ├── pages/PostsList.tsx
│   │   ├── pages/PostCreate.tsx
│   │   └── pages/PostEdit.tsx
│   └── Dockerfile
├── nginx/default.conf
├── routes/api.php
├── docker-compose.yml
└── .env.docker
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devops-test-app.git
cd devops-test-app
```

### 2. Create the Docker environment file

```bash
cp .env.docker.example .env.docker
```

Update `.env.docker` with your values if needed (defaults work out of the box).

### 3. Start all services

```bash
docker compose up -d --build
```

This starts four containers:

| Container | Description | Port |
|---|---|---|
| `devops-test-app` | Laravel PHP-FPM application | — |
| `devops-test-nginx` | Nginx web server | `8000` |
| `devops-test-frontend` | React frontend (Nginx) | `3000` |
| `devops-test-db` | MySQL 8.0 database | `3307` |

### 4. Run migrations and seed the database

```bash
docker compose exec app php artisan migrate --seed
```

### 5. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |

---

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/posts` | List all posts |
| `POST` | `/posts` | Create a new post |
| `GET` | `/posts/{id}` | Get a single post |
| `PUT` | `/posts/{id}` | Update a post |
| `DELETE` | `/posts/{id}` | Delete a post |

### Example request

```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "body": "My first post."}'
```

---

## Environment Variables

Key variables in `.env.docker`:

| Variable | Description |
|---|---|
| `APP_NAME` | Application name |
| `APP_KEY` | Laravel encryption key (generate with `php artisan key:generate`) |
| `DB_HOST` | Database host (use `db` for Docker) |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` / `DB_PASSWORD` | Database credentials |
| `VITE_API_URL` | API base URL used by the frontend |

---

## Useful Commands

```bash
# View running containers
docker compose ps

# Tail application logs
docker compose logs -f app

# Run artisan commands
docker compose exec app php artisan <command>

# Stop all services
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v
```

---

## Running Tests

```bash
docker compose exec app php artisan test
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
