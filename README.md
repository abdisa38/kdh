# Karadibayu Primary School Management & Student Portal System
## ካራዲባዩ አንደኛ ደረጃ ትምህርት ቤት

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application tailored for **Karadibayu Primary School**, adhering strictly to the Ethiopian Ministry of Education (MoE) primary curriculum standards (Grades 1 to 8).

---

## 🏛️ System Features & Portals

1. **Public School Portal**:
   - Institutional History, Mission & Vision, and Leadership.
   - Bilingual Ethiopian School Notice Board & Announcements.
   - Quick **Online Student Result Lookup** by Student ID (e.g., `KPS/2026/001`).

2. **Student & Parent Portal**:
   - Secure login via Student ID and password.
   - Continuous Assessment (50%) & Final Exam (50%) breakdown per subject.
   - Class Section Rank (1st, 2nd, 3rd...), Semester Average (%), and Total Points.
   - Official Printable Ethiopian Primary School Report Card (የውጤት መግለጫ ካርድ) with print styling.
   - Disciplinary conduct rating (A, B, C, D) and attendance days tracking.

3. **Teacher Portal**:
   - Assigned classroom & subject gradebooks.
   - Interactive spreadsheet-style Marksheet Grid for Quiz 1, Quiz 2, Test 1, Assignment, Mid Exam, and Final Exam.
   - Live validation against max allocated marks and auto-calculation of totals and letter grades.
   - Bulk save and homeroom ranking computation engine.

4. **Admin & Director Portal**:
   - Institutional metrics: Gender distribution, pass rates, honor roll top students.
   - Student management with Ethiopian 3-part names (First, Father's, Grandfather's).
   - Teaching faculty management & subject allocations.
   - Grade 1-8 sections management.
   - Master Mark Sheet (ማስተር ሺት) table and PDF/Print export.
   - Notice board publication.

---

## 🚀 Getting Started

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed     # Seeds realistic Ethiopian primary school dataset (classes, teachers, students, marks)
npm start        # Starts API server on http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Director / Admin** | `admin` | `admin123` | Full administrative control & master sheets |
| **Registrar Officer** | `registrar` | `registrar123` | Student enrollment & records |
| **Math Teacher** | `teacher.abdisa` | `teacher123` | Grade 7 Mathematics & Homeroom Teacher |
| **English Teacher** | `teacher.selam` | `teacher123` | Grade 7 English Teacher |
| **Science Teacher** | `teacher.tariku` | `teacher123` | Grade 7 General Science Teacher |
| **Grade 7 Student (Rank 1)** | `kps2026001` *(or ID: `KPS/2026/001`)* | `kps123456` | Dawit Bekele Haile (96% Avg, Rank 1) |
| **Grade 7 Student (Rank 2)** | `kps2026002` *(or ID: `KPS/2026/002`)* | `kps123456` | Bethelhem Yohannes Girma (92% Avg, Rank 2) |
| **Grade 7 Student (Rank 3)** | `kps2026003` *(or ID: `KPS/2026/003`)* | `kps123456` | Robel Tesfaye Abebe (88% Avg, Rank 3) |
