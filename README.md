# Thesis Project — TCC Management System

This repository contains the full implementation of the **TCC (Final Graduation Project) Management System**, developed as my undergraduate thesis and one of my most ambitious solo projects.

The system is divided into **frontend** and **backend** components.  
Below you will find setup instructions for running the project locally, prepared for testing, development, and academic demonstration purposes.

---

## Frontend Installation

The frontend is built with **Next.js**, **PrimeReact**, **TailwindCSS**, and other modern libraries.  
Follow the steps below to run the user interface locally.

### 1. Navigate to the frontend directory

Open a terminal and run:

```bash
cd frontend
```

> Make sure you are in the project root (`/MeuTCC-IFRS-Restinga`) before running this command.

### 2. Install dependencies

Run:

```bash
npm install
```

> This installs all required frontend dependencies.

### 3. Run the development server

After installation, start the frontend using:

```bash
npm run dev
```

The application will be available at:  
[http://localhost:3000](http://localhost:3000)

> The interface will load correctly only when the backend server is running.

---

## Backend Installation

The backend was developed using **Django 5**, with integration for **Google Drive**, **Google Authentication**, and other academic workflow tools.  
Follow these steps to set it up locally.

### 1. Navigate to the backend directory

Open a terminal and run:

```bash
cd backend
```

> Make sure you are in the project root (`/MeuTCC-IFRS-Restinga`) before running this command.

### 2. Install dependencies

Ensure **Python** is installed, then execute:

```bash
pip install -r requirements.txt
```

---

### 3. Configure environment variables

1. Open the `meutcc/` directory.  
2. Duplicate the file `env_example_settings.py` and rename it to `env_settings.py`.  
3. Fill in the following fields with your own credentials:

```python
GOOGLE_OAUTH2_CLIENT_ID = ""
GOOGLE_OAUTH2_CLIENT_SECRET = ""
GOOGLE_OAUTH2_REDIRECT_URI = ""

AUTH_FRONTEND_URL = ""
AUTH_ERROR_FRONTEND_URL = ""

GOOGLE_OAUTH2_SCOPE = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

GOOGLE_DRIVE_OAUTH2_CLIENT_ID = ""
GOOGLE_DRIVE_OAUTH2_CLIENT_SECRET = ""
GOOGLE_DRIVE_OAUTH2_REDIRECT_URI = ""

GOOGLE_DRIVE_OAUTH2_SCOPE = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file'
]

GOOGLE_DRIVE_CREDENTIALS_JSON = '''{ ... }'''
```

---

### 4. Initialize the database

Run the following commands to apply migrations:

```bash
py manage.py makemigrations
py manage.py migrate
```

---

### 5. Seed the system with test data

Use the custom command included in the project:

```bash
py manage.py setup_test_enviroment
```

This command runs seed scripts that generate simulated data for users, courses, professors, students, and other essential entities for testing and demonstration.

---

## Running the System

Once the environment is configured, run the backend and frontend simultaneously in separate terminals.

### 1. Start the backend server

From the `/backend` directory, run:

```bash
py manage.py runserver
```

The backend will be available at:  
[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 2. Start the frontend

With the backend running, open another terminal, navigate to `/frontend`, and execute:

```bash
npm run dev
```

The frontend will be available at:  
[http://localhost:3000](http://localhost:3000)

---

## Contributing or Reporting Issues

If you wish to contribute, suggest improvements, or report bugs, please open an issue in this repository.  
Contributions and feedback are welcome, especially from academic collaborators or developers interested in educational management systems.

---

**Author:** Matheus Machado  
Undergraduate Thesis — IFRS Campus Restinga  
[GitHub @mmachado77](https://github.com/mmachado77)
