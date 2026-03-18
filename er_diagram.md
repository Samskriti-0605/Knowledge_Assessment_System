# Knowledge Assessment System ER Diagram

Below is the Entity-Relationship Diagram for your database. You can view this using any Markdown previewer that supports Mermaid.js, such as the built-in VS Code preview (with a Mermaid extension) or by pasting it into a tool like [Mermaid Live Editor](https://mermaid.live).

```mermaid
erDiagram
    users ||--o{ assessments : "creates (if teacher)"
    users ||--o{ submissions : "makes (if student)"
    assessments ||--o{ questions : "contains"
    assessments ||--o{ submissions : "has"

    users {
        int id PK
        varchar(100) name
        varchar(100) email UK
        varchar(255) password_hash
        enum role "student/teacher"
        varchar(50) class_name
        varchar(10) section
        varchar(20) roll_number
        varchar(100) subject
        varchar(20) phone_number
        timestamp created_at
    }

    assessments {
        int id PK
        varchar(200) title
        text description
        int created_by FK "references users.id"
        varchar(50) class_name
        varchar(10) section
        int duration_minutes
        timestamp created_at
    }

    questions {
        int id PK
        int assessment_id FK "references assessments.id"
        text question_text
        varchar(200) option_a
        varchar(200) option_b
        varchar(200) option_c
        varchar(200) option_d
        enum correct_option "A/B/C/D"
        int marks
        timestamp created_at
    }

    submissions {
        int id PK
        int user_id FK "references users.id"
        int assessment_id FK "references assessments.id"
        int score
        int total_marks
        timestamp submitted_at
    }
```
