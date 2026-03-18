# Knowledge Assessment System Documentation

## Tech Stack & Architecture

The project follows a **Modified LAMP Stack Architecture** (Linux/Windows, Apache, MySQL, PHP) combined with a modern React Frontend (MERN-like structure but with PHP/MySQL):

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React.js (Vite), HTML5, CSS3 (Glassmorphism UI) |
| **Backend** | PHP (Native), Apache Web Server |
| **Database** | MySQL (Relational Database) |
| **Authentication** | Secure Session & Password Hashing (Bcrypt) |
| **Version Control** | Git & GitHub |

### Justification for Tech Stack

*   **React (Vite):** Provides a fast, component-based UI for dynamic assessment interfaces and real-time feedback.
*   **PHP:** Widely supported server-side language for robust backend logic and API development.
*   **MySQL:** Relational database ideal for structured data like users, assessments, questions, and results.
*   **CSS3 (Glassmorphism):** Custom styling for a modern, premium user experience.
*   **Axios:** Efficient HTTP client for handling API requests between React and PHP.

## Web Application Architecture

**System Flow Explanation:**

1.  **User Interaction:** User interacts with the React Frontend (Dashboard, Assessment Interface).
2.  **API Request:** Frontend sends HTTP requests (GET/POST) via Axios to the PHP Backend.
3.  **Processing:** PHP API validates requests, handles business logic, and authenticates users.
4.  **Database Operation:** Data is stored/retrieved from the MySQL Database using PDO (PHP Data Objects).
5.  **Response:** JSON response is returned to the Frontend for rendering.

## Database Schema

### 3.1 Entities Identified

*   **Users** (Students & Teachers)
*   **Assessments**
*   **Questions**
*   **Submissions**

### 3.2 User Entity

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Primary Key (Auto Increment) |
| `name` | VARCHAR(100) | Full Name |
| `email` | VARCHAR(100) | Unique Login Email |
| `password_hash`| VARCHAR(255) | Secure Hashed Password |
| `role` | ENUM | 'student' or 'teacher' |
| `class_name` | VARCHAR(50) | Class (Student Only) |
| `section` | VARCHAR(10) | Section (Student Only) |
| `roll_number` | VARCHAR(20) | Roll Number (Student Only) |
| `subject` | VARCHAR(100) | Subject (Student/Teacher) |
| `phone_number` | VARCHAR(20) | Contact Number |
| `created_at` | TIMESTAMP | Registration Time |

### 3.3 Assessment Entity

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Primary Key |
| `title` | VARCHAR(200) | Assessment Title |
| `description` | TEXT | Assessment Details |
| `created_by` | INT (FK) | ID of Teacher who created it |
| `duration_minutes`| INT | Duration in minutes (Default: 30) |
| `created_at` | TIMESTAMP | Creation Time |

### 3.4 Question Entity

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Primary Key |
| `assessment_id`| INT (FK) | Related Assessment ID |
| `question_text`| TEXT | The Question itself |
| `option_a` | VARCHAR(200) | Option A |
| `option_b` | VARCHAR(200) | Option B |
| `option_c` | VARCHAR(200) | Option C |
| `option_d` | VARCHAR(200) | Option D |
| `correct_option`| ENUM | Correct Answer ('A', 'B', 'C', 'D')|
| `marks` | INT | Marks for this question |

### 3.5 Submission Entity

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Primary Key |
| `user_id` | INT (FK) | Student ID |
| `assessment_id`| INT (FK) | Assessment ID |
| `score` | INT | Obtained Score |
| `total_marks` | INT | Maximum Possible Score |
| `submitted_at` | TIMESTAMP | Submission Time |

### 3.6 Relationship Summary

*   **One Teacher** → Many **Assessments**
*   **One Assessment** → Many **Questions**
*   **One Student** → Many **Submissions**
*   **One Assessment** → Many **Submissions**

## UI/UX Wireframes & Theme

### 4.1 Design Tools

*   **Figma / Sketch:** (Conceptual Wireframes)
*   **CSS3:** Custom Glassmorphism Theme (blur effects, gradients, semi-transparent backgrounds).
*   **React Irons/Lucide:** Modern icons for intuitive navigation.

### 4.2 User Flow

**Student Flow:**
Landing Page → Register/Login → Student Dashboard → View Available Assessments → Take Assessment (Timer Active) → Submit → View Immediate Result/Score.

**Teacher Flow:**
Landing Page → Register/Login → Teacher Dashboard → Create New Assessment → Add Questions → View Student Results/Analytics.

## Project Boilerplate Setup

### 5.1 Folder Structure

```
knowledge-assessment/
│
├── frontend/ (React App)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/ (API)
│   ├── api/ (Endpoints: auth.php, assessments.php, etc.)
│   ├── config/ (db.php)
│   ├── database.sql
│   └── .htaccess
│
├── .gitignore
├── README.md
└── project_documentation.md
```

## GitHub Workflow & Documentation

### 6.1 Repository Setup

*   Git initialized.
*   Separate `frontend` and `backend` directories.
*   `node_modules` and sensitive config files excluded via `.gitignore`.
