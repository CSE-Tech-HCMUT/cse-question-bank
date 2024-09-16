# Description

CSE Question Bank

## Technology

Frontend: Reactjs

Backend: Golang

Databse: PostgreSQL

## How to run localy

### Prerequisites

Having docker and docker-compose already install on you machine

### Clone the project

Clone the project to your machine

### Create environment files for the application

Create 3 .env file: `.env`, `client/.env` and `server/.env`

#### `.env` file

In the root directory:

```bash
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

- DB_DATABASE: The name of your database.
- DB_USERNAME: The username used to access your database.
- DB_PASSWORD: The password used to access your database.

#### `client/.env` file

```bash
VITE_API_PATH=
VITE_CLIENT_PATH=
```

- VITE_API_PATH: The URL where your api is hosted. This will allow your frontend to communicate with your backend.
- VITE_CLIENT_PATH: The URL where your frontend is hosted.

#### `server/.env` file

```bash
DOMAIN_NAME=
SERVER_PORT=

DB_HOST=

DB_HOSTNAME=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_SCHEMA=
DB_DATABASE=

TOKEN_DURATION=
COOKIE_DURATION=

JWT_SECRET_KEY=
```

- DOMAIN_NAME:
- SERVER_PORT:
- DB_HOST:
- DB_HOSTNAME:
- DB_USERNAME:
- DB_PASSWORD:
- DB_PORT:
- DB_SCHEMA:
- DB_DATABASE:
- TOKEN_DURATION:
- COOKIE_DURATION:
- JWT_SECRET_KEY:

### Run the application

```bash
cd cse-question-bank
docker-compose up
```
