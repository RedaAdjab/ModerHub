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

## Backend Setup

1. Move to backend:
   - `cd backend`
2. Create and activate a virtual environment.
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Copy environment template:
   - `copy .env.example .env`
5. Optional: from project root, copy Docker environment template:
   - `cd ..`
   - `copy .env.example .env`
6. Optional: start MySQL with Docker from project root:
   - `docker compose up -d mysql`
7. Run migrations:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
8. Create admin user (optional):
   - `python manage.py createsuperuser`
9. Start backend server:
   - `python manage.py runserver`

Backend default URL: `http://127.0.0.1:8000`

## Frontend Setup

1. Move to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Copy environment template:
   - `copy .env.example .env`
4. Start frontend dev server:
   - `npm run dev`

Frontend default URL: `http://localhost:5173`

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

## Notes

- MySQL is used when `MYSQL_NAME` is set in backend `.env`.
- If `MYSQL_NAME` is empty, Django uses SQLite automatically.
- CORS is pre-configured for `http://localhost:5173`.

## Suggested Next Steps

- add image upload support for posts and avatars
- add social login (Google/GitHub)
- add role-based permissions for editor/admin workflows
- add CI for backend/frontend tests and formatting
