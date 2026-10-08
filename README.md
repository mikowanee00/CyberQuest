# CyberQuest – Cybersecurity Awareness Game (MERN)

An interactive website that teaches students to recognize online threats through **10 lessons**.
Each lesson has a short reading section, a hands-on practice activity and a quiz with instant
feedback. Players earn XP, stars and badges. A **MongoDB database** records every player, every
lesson they complete and every quiz they take. An **admin dashboard** shows all of it and
exports it as CSV files for charts in Excel.

| Layer | Technology | Folder |
|-------|------------|--------|
| **M**ongoDB | Database (via the Mongoose library) | `server/src/models` |
| **E**xpress | REST API (web server) | `server/src` |
| **R**eact | User interface (built with Vite) | `client/src` |
| **N**ode.js | Runs the server and the tools | — |

---

## Table of contents

1. [Install the software you need](#1-install-the-software-you-need)
2. [Get the code](#2-get-the-code)
3. [Install the project packages](#3-install-the-project-packages)
4. [Set up the database and the `.env` file](#4-set-up-the-database-and-the-env-file)
5. [Run the website](#5-run-the-website)
6. [See all users in the database](#6-see-all-users-in-the-database)
7. [Make charts from the data](#7-make-charts-from-the-data)
8. [Run the automated tests](#8-run-the-automated-tests)
9. [Push the code to GitHub](#9-push-the-code-to-github)
10. [Project structure (MVC)](#10-project-structure-mvc)
11. [API reference](#11-api-reference)
12. [Database collections](#12-database-collections)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Install the software you need

Install these once. Restart your computer (or at least close and reopen every terminal) afterwards.

| Software | Why | Download | Check it worked (in a terminal) |
|----------|-----|----------|----------------------------------|
| **Node.js 20 LTS or newer** (includes npm) | Runs the server and builds the React app | <https://nodejs.org> → "LTS" | `node -v` → v20 or higher<br>`npm -v` |
| **Git** | Version control and pushing to GitHub | <https://git-scm.com/downloads> (use the default options) | `git --version` |
| **MongoDB Community Server** *(Option A)* | The database on your own computer | <https://www.mongodb.com/try/download/community> → choose the **MSI** for Windows, keep **"Install MongoDB as a Service"** ticked | It starts automatically in the background |
| **MongoDB Compass** | A program to *look at* the database (all users, quiz attempts) | Usually installed together with MongoDB. Otherwise: <https://www.mongodb.com/try/download/compass> | Open Compass |
| **Visual Studio Code** *(recommended)* | Code editor with a built-in terminal | <https://code.visualstudio.com> | — |

> **Option B — no database install:** you can use the free cloud database **MongoDB Atlas** instead of
> MongoDB Community Server. See step 4, Option B.

**How to open a terminal:** in VS Code choose **Terminal → New Terminal**. On Windows you can also
press the Windows key, type `cmd` or `PowerShell` and press Enter.

---

## 2. Get the code

1. Clone the repository into a folder with a **short path**, for example `C:\Projects`.
   Very long folder paths can make `npm install` fail on Windows.

   ```bash
   cd C:\Projects
   git clone https://github.com/mikowanee00/cyberquest.git
   ```

2. Open the `cyberquest` folder in VS Code (**File → Open Folder…**), then open a terminal
   (**Terminal → New Terminal**). The terminal starts inside the project folder.

---

## 3. Install the project packages

In the terminal, inside the project folder, run:

```bash
npm run install-all
```

This installs the packages for the root, the `server` folder and the `client` folder
(Express, Mongoose, React, Vite, …). It creates `node_modules` folders and takes 1–3 minutes.

---

## 4. Set up the database and the `.env` file

The server reads its settings from `server/.env`. Create it by copying the example file:

```bash
# Windows (PowerShell or VS Code terminal)
Copy-Item server/.env.example server/.env

# Windows (cmd)
copy server\.env.example server\.env

# macOS / Linux
cp server/.env.example server/.env
```

Open `server/.env` in VS Code and change these values:

```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cyberquest
ADMIN_KEY=pick-a-long-secret-only-you-know
```

- **`ADMIN_KEY`** is the password for the admin dashboard. Choose your own.
- **`MONGODB_URI`** depends on the database you use:

### Option A — local MongoDB (installed in step 1)

Keep `MONGODB_URI=mongodb://127.0.0.1:27017/cyberquest`. MongoDB creates the `cyberquest` database
automatically the first time someone signs up.

### Option B — MongoDB Atlas (free cloud database)

1. Create a free account at <https://www.mongodb.com/cloud/atlas/register>.
2. Create a **free (M0) cluster**.
3. **Database Access** → *Add New Database User* → choose a username and password (write them down).
4. **Network Access** → *Add IP Address* → *Allow access from anywhere* (`0.0.0.0/0`) for testing.
5. **Database → Connect → Drivers** → copy the connection string. It looks like
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
6. In `server/.env`, paste it, put in your username and password, and add `cyberquest` after the last `/`:

   ```ini
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/cyberquest
   ```

> **Just want to try it first?** Skip the database setup and run `npm run dev:memory` in step 5.
> It starts a temporary database in memory (the first run downloads ~100 MB). **All data is lost
> when you stop it**, so use Option A or B for your real user testing. In this mode the admin key
> is `demo-admin-key` unless you set your own.

---

## 5. Run the website

```bash
npm run dev
```

This starts two programs at once:

- the **API server** on <http://localhost:5000> (Express + MongoDB)
- the **React website** on <http://localhost:5173> (Vite)

Open **<http://localhost:5173>** in your browser. You should see the CyberQuest home page.
In the terminal you should see `MongoDB connected` and `CyberQuest API running`.

To stop both, click in the terminal and press **Ctrl + C**.

**Using the game:**

1. On the Home page type a nickname, tick the consent box and click **Start the mission**.
2. **Write down the player code** that appears. With your nickname, it lets you log in on another device.
3. Open a lesson, read it, complete the practice activity, then take the quiz.
4. **My Progress** shows your XP, rank, badges and history.

**Production mode** (one server, optimized files):

```bash
npm run build
npm start
```

Then open <http://localhost:5000>.

---

## 6. See all users in the database

### a) The admin dashboard (in the website)

1. Go to <http://localhost:5173/admin> (or click **Admin dashboard** in the footer).
2. Enter the `ADMIN_KEY` from `server/.env`.
3. Tabs:
   - **Overview:** number of players, quiz attempts, average score, and statistics for each lesson
   - **Players:** every user. Click a row to see their lessons and every quiz answer.
   - **Questions:** % correct for each question, hardest first
   - **Export CSV:** download the data for Excel

### b) MongoDB Compass (the raw database)

1. Open **MongoDB Compass**.
2. Connect to `mongodb://127.0.0.1:27017` (Option A), or paste your Atlas connection string (Option B).
3. Open the **`cyberquest`** database. You will see three collections:
   - **`users`:** one document per player
   - **`lessonprogresses`:** one document per player per lesson (best score, passed, …)
   - **`quizattempts`:** one document per finished quiz, including every answer

---

## 7. Make charts from the data

1. Admin dashboard → **Export CSV** → download, for example, `lessons.csv`.
2. Open the file in **Excel**.
3. Select two columns, for example **Title** and **Average score %**.
4. **Insert → Charts → Clustered Column** (or Bar / Pie).
5. Use the **+** button next to the chart to add a **chart title** and **axis titles**.
6. Save as **.xlsx** to keep the chart.

| File | One row per | Good charts |
|------|-------------|-------------|
| `users.csv` | player | lessons completed per player, XP per player |
| `attempts.csv` | finished quiz | scores over time, attempts per lesson |
| `lessons.csv` | lesson | average score and pass rate per lesson |
| `questions.csv` | question | hardest questions (% correct) |

---

## 8. Run the automated tests

```bash
npm test
```

This runs 16 API tests: registration, login, saving quiz results, tamper protection, admin access,
CSV export and account deletion. They use a temporary in-memory database, so your real data is never
touched. The first run downloads a MongoDB test binary (~100 MB).

---

## 9. Push the code to GitHub

Run these commands in the project folder (the folder you cloned in step 2).

**Step 1 — Tell Git who you are** (once per computer):

```bash
git config --global user.name "Your Name"
git config --global user.email "tasnimbushra1228@gmail.com"
```

**Step 2 — Check what will be uploaded:**

```bash
git add -A
git status
```

Make sure that **`node_modules`** and **`server/.env`** are **not** in the list. The `.gitignore` file
keeps them out. Your `.env` holds your secrets and must never go to GitHub.

**Step 3 — Commit and push:**

```bash
git commit -m "Rebuild CyberQuest as a MERN app with MVC and a MongoDB database"
git push
```

The first time you push, a **GitHub sign-in window** opens. Sign in to allow the upload.
Refresh your repository page on GitHub to see the new files.

**Later changes:** after editing files, run the same three commands:

```bash
git add -A
git commit -m "Describe what you changed"
git push
```

> **Note:** GitHub Pages can only host static websites, so it cannot run this MERN version (it needs a
> Node.js server and a database).
> To put the MERN version online, use a host such as Render (<https://render.com>) with MongoDB Atlas.

---

## 10. Project structure (MVC)

The project follows the **Model–View–Controller** pattern:

- **Model:** Mongoose schemas define how data is stored in MongoDB (`server/src/models`).
- **View:** the React app shows the data and handles user input (`client/src`).
- **Controller:** Express controllers receive requests, use the models and services, and send JSON back (`server/src/controllers`).
- **Routes** connect URLs to controllers. **Services** hold the business rules (XP, best scores, badges).

```
cyberquest/
├── package.json              Root scripts: install-all, dev, build, start, test
├── README.md                 This guide
├── server/                   ── BACK END (Node.js + Express + MongoDB) ──
│   ├── .env.example          Settings template → copy to .env
│   ├── package.json
│   ├── scripts/
│   │   └── memoryServer.js   Run with a temporary in-memory database
│   ├── tests/
│   │   └── api.test.js       16 automated API tests
│   └── src/
│       ├── server.js         Entry point: load .env, connect DB, start server
│       ├── app.js            Express app: middleware + routes (+ serves React build)
│       ├── config/
│       │   ├── db.js         MongoDB connection
│       │   └── constants.js  Scoring rules, lesson titles, ranks
│       ├── models/           ◆ MODEL
│       │   ├── User.js
│       │   ├── LessonProgress.js
│       │   └── QuizAttempt.js
│       ├── controllers/      ◆ CONTROLLER
│       │   ├── userController.js      register, login, profile, delete
│       │   ├── progressController.js  lesson visits, activities, quizzes
│       │   └── adminController.js     dashboard data + CSV exports
│       ├── routes/           URL → controller
│       │   ├── userRoutes.js   /api/users
│       │   ├── meRoutes.js     /api/me
│       │   └── adminRoutes.js  /api/admin
│       ├── services/
│       │   └── progressService.js  XP, best score, badge rules
│       ├── middleware/
│       │   ├── auth.js          player check, admin check, lesson id check
│       │   └── errorHandler.js  friendly JSON error messages
│       └── utils/
│           ├── helpers.js       errors, player codes, CSV
│           └── scoring.js       XP and rank calculations
├── client/                   ── FRONT END (React) = ◆ VIEW ──
│   ├── index.html
│   ├── vite.config.js        Dev server + /api proxy to port 5000
│   ├── public/favicon.svg
│   └── src/
│       ├── main.jsx          React entry point
│       ├── App.jsx           Layout + routes
│       ├── styles.css        All styling (light/dark, responsive)
│       ├── api/client.js     All requests to the server
│       ├── context/          Shared state (PlayerContext, ToastContext)
│       ├── data/lessons.js   10 lessons, activities and 50 quiz questions
│       ├── logic/            QuizEngine, scoring, password analyzer, effects
│       ├── components/       Header, Footer, Icon, Visual, common UI
│       │   └── activities/   7 interactive activity components
│       └── pages/            Home, Lessons, Lesson, Quiz, Results, Progress, Help, Admin
```

---

## 11. API reference

Player requests send the headers `x-user-id` and `x-player-code`. Admin requests send `x-admin-key`.

| Method | URL | Who | What it does |
|--------|-----|-----|--------------|
| GET | `/api/health` | anyone | server and database status |
| POST | `/api/users` | anyone | register `{ nickname, consent: true }` → returns `playerCode` |
| POST | `/api/users/login` | anyone | log in `{ nickname, playerCode }` |
| GET | `/api/me` | player | profile, lesson progress, history, totals |
| PATCH | `/api/me` | player | change nickname |
| POST | `/api/me/reset` | player | erase my progress |
| GET | `/api/me/export` | player | download all my data |
| DELETE | `/api/me` | player | delete my account and data |
| POST | `/api/me/lessons/:id/visit` | player | lesson opened |
| POST | `/api/me/lessons/:id/activity` | player | practice activity finished |
| POST | `/api/me/lessons/:id/quiz` | player | save a quiz `{ score, total, bonus, durationSeconds, answers[] }` |
| GET | `/api/admin/summary` | admin | totals + statistics per lesson |
| GET | `/api/admin/users` | admin | all players |
| GET | `/api/admin/users/:id` | admin | one player with all quiz attempts |
| DELETE | `/api/admin/users/:id` | admin | delete a player |
| GET | `/api/admin/attempts` | admin | quiz attempts (`?lessonId=&userId=`) |
| GET | `/api/admin/questions` | admin | % correct per question |
| GET | `/api/admin/export/:dataset` | admin | CSV: `users`, `attempts`, `lessons`, `questions` |

---

## 12. Database collections

**users**

| Field | Type | Notes |
|-------|------|-------|
| nickname | String | 2–24 characters, unique (not case-sensitive) |
| playerCodeHash | String | SHA-256 hash of the player code (the code itself is never stored) |
| consent | Boolean | agreed to data collection |
| consentAt, lastActiveAt, createdAt, updatedAt | Date | |

**lessonprogresses** (one per user per lesson)

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId → users | |
| lessonId | Number | 1–10 |
| visited, activityDone, passed | Boolean | |
| attempts, bestScore, bestPercent, bestBonus, total | Number | the best attempt counts |
| completedAt, lastPlayedAt | Date | |

**quizattempts** (one per finished quiz)

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId → users | |
| lessonId, score, total, percent, bonus, durationSeconds | Number | |
| passed | Boolean | percent ≥ 70 |
| answers | Array | `{ question, fromLesson, chosen, correctAnswer, correct, timedOut }` |
| createdAt | Date | when the quiz was finished |

---

## 13. Troubleshooting

| Problem | Fix |
|---------|-----|
| `'npm' is not recognized` / `'node' is not recognized` | Install Node.js (step 1), then close and reopen the terminal or VS Code. |
| `npm install` fails with `ENOENT` or `EPERM` on Windows | Move the project to a short path such as `C:\Projects\cyberquest` and run `npm run install-all` again. |
| `Could not start the server: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Windows: press the Windows key, open **Services**, find **MongoDB Server** and click **Start**. Or use Atlas (step 4, Option B) or `npm run dev:memory`. |
| `MONGODB_URI is not set` | You haven't created `server/.env` yet (step 4). |
| Atlas: `bad auth` or a timeout | Check the username and password in the connection string, and **Network Access → allow your IP**. |
| Website says "Cannot reach the CyberQuest server" | The API server isn't running. Use `npm run dev` (not only `npm run dev --prefix client`). |
| Admin dashboard: "Wrong admin key" | Use the exact `ADMIN_KEY` from `server/.env`, then restart the server after changing `.env`. |
| `Port 5000 is already in use` | Change `PORT=5001` in `server/.env` **and** the proxy target in `client/vite.config.js`. |
| "That nickname is already taken" | Choose another nickname, or log in with that nickname and its player code. |
| Lost player code | The admin can delete the old player (Admin → Players → Delete player) so they can sign up again. |
