# ModernHub Full-Stack Website (Django + MySQL + React)

ModernHub is a complete generic website starter that includes common modern functionality:

- user registration/login/logout with token auth
- profile management
- content publishing (posts, categories)
- public feed with search, filtering, and pagination
- featured content section
- post details with comments
- contact form endpoint and page
- newsletter subscription endpoint and UI
- responsive modern frontend with routed pages
- Django admin panel for content operations

## Tech Stack

- Backend: Python, Django, Django REST Framework
- Database: MySQL (with SQLite fallback for quick local setup)
- Frontend: React + Vite
- Styling: HTML/CSS (custom responsive design)

## Project Structure

- backend: Django API project
- frontend: React application
- docker-compose.yml: MySQL service for local development

## API Endpoints

### Authentication

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/` (token required)
- `GET/PATCH /api/auth/me/` (token required)

### Content

- `GET /api/categories/`
- `GET/POST /api/posts/`
- `GET /api/posts/featured/`
- `GET/PATCH/DELETE /api/posts/<slug>/`
- `GET/POST /api/posts/<slug>/comments/`

### Website Utilities

- `GET /api/stats/`
- `POST /api/contact/`
- `POST /api/newsletter/`
- `GET /api/health/`

> **Note:** This project was created and later abandonned in summer 2025.
