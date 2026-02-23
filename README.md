## Alarm & Reminder System – Backend

This is the backend service for the **Alarm & Reminder System**.  
It is a simple REST API built with **Node.js** and **Express**, which stores reminders in a local JSON file (`reminders.json`).

The backend exposes endpoints to:

- **Create** a reminder
- **Read** all reminders
- **Update** an existing reminder
- **Delete** a reminder

There is also an unused Mongoose model and MongoDB connection helper in the project, which can be wired up later if you want to move from file-based storage to a database.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Other packages**:
  - `cors` – enable CORS for frontend access
  - `dotenv` – environment variables (currently only used in the MongoDB helper)
  - `mongoose` – MongoDB ODM (model/helper file exists but not connected yet)
  - `bcryptjs`, `jsonwebtoken`, `multer` – installed but **not currently used** in this backend code

---

## Project Structure

```text
backend/
├── index.js                # Main Express server, JSON-file based reminders API
├── reminders.json          # Local storage for reminders (auto-created if missing)
├── config/
│   └── dB.js               # MongoDB connection helper (not used yet)
└── models/
    └── reminder.model.js   # Mongoose Reminder model (not used yet)
```

---

## Getting Started

### 1. Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

### 2. Install dependencies

From the backend project root:

```bash
npm install
```

This will install all dependencies from `package.json`.

### 3. Running the server

Available npm scripts:

- **Production / normal run**

  ```bash
  npm start
  ```

- **Development (with auto-restart via nodemon)**

  ```bash
  npm run dev
  ```

By default, the server listens on:

- **URL**: `http://localhost:5001`

You should see a log in the terminal similar to:

```text
✅ Server running at http://localhost:5001
📁 Data stored in: /path/to/project/reminders.json
```

---

## API Overview

Base URL (during local development):

- `http://localhost:5001`

### Health Check

- **Endpoint**: `GET /`
- **Description**: Simple health endpoint to confirm that the backend is running.
- **Response (200)**: Text message

```json
"Alarm & Reminder API is running ✅"
```

---

### Get All Reminders

- **Endpoint**: `GET /api/reminders`
- **Description**: Returns the list of all reminders stored in `reminders.json`.
- **Response (200)**: Array of reminder objects.

**Example response:**

```json
[
  {
    "_id": "1771845345906",
    "title": "asdfg",
    "note": "qwerty",
    "datetime": "2026-02-23T16:45",
    "status": "scheduled",
    "enabled": true,
    "createdAt": "2026-02-23T11:15:45.906Z"
  }
]
```

---

### Create a Reminder

- **Endpoint**: `POST /api/reminders`
- **Description**: Creates a new reminder and appends it to `reminders.json`.
- **Body (JSON)**:

```json
{
  "title": "Meeting with team",
  "note": "Discuss project updates",
  "datetime": "2026-02-23T16:45",
  "status": "scheduled",
  "enabled": true
}
```

**Notes:**

- `title` (string) – **required**
- `datetime` (ISO-like date string) – **required**
- `note` (string) – optional
- `status` – optional, defaults to `"scheduled"`
- `enabled` – optional, defaults to `true`
- `_id` and `createdAt` are generated on the server:
  - `_id`: `Date.now().toString()`
  - `createdAt`: current time in ISO format

**Response (201)**: The newly created reminder object.

---

### Update a Reminder

- **Endpoint**: `PUT /api/reminders/:id`
- **Description**: Partially updates an existing reminder by its `_id`.
- **URL Params**:
  - `id` – `_id` of the reminder to update

- **Body (JSON)** – only include the fields you want to update:

```json
{
  "title": "Updated title",
  "note": "Updated note",
  "datetime": "2026-02-23T18:00",
  "status": "completed",
  "enabled": false
}
```

Any missing fields are left unchanged on the existing reminder.

**Responses:**

- `200 OK` – returns the updated reminder
- `404 Not Found` – if the reminder with the given `id` does not exist

---

### Delete a Reminder

- **Endpoint**: `DELETE /api/reminders/:id`
- **Description**: Deletes a reminder by `_id`.
- **URL Params**:
  - `id` – `_id` of the reminder to delete

**Responses:**

- `200 OK`:

  ```json
  {
    "message": "Reminder deleted"
  }
  ```

- `404 Not Found`:

  ```json
  {
    "message": "Reminder not found"
  }
  ```

---

## Data Storage Details

- Reminders are stored in `reminders.json` in the project root.
- On startup or when the first read happens:
  - If `reminders.json` **does not exist**, it is automatically created with an empty array `[]`.
- All reads and writes are synchronous using Node's `fs` module.

**Reminder object shape (current file-based version):**

```json
{
  "_id": "string",                // generated from Date.now().toString()
  "title": "string",
  "note": "string",
  "datetime": "string",           // date-time string
  "status": "scheduled|completed",
  "enabled": true,
  "createdAt": "ISO timestamp"
}
```

---

## MongoDB Model (Not Wired Up Yet)

The project contains:

- `config/dB.js` – Uses `mongoose.connect(process.env.MONGODB_URL)` to connect to MongoDB.
- `models/reminder.model.js` – A Mongoose schema/model for reminders:
  - `title` – required string
  - `note` – optional string
  - `datetime` – required `Date`
  - `status` – `"scheduled"` or `"completed"`, default `"scheduled"`
  - `enabled` – boolean, default `true`
  - `timestamps: true` adds `createdAt` and `updatedAt`

Currently, `index.js` does **not** use these; the API is fully file-based.  
If you want to switch to MongoDB in the future, you can:

- Import and call `connectDb()` from `config/dB.js` in `index.js`.
- Replace the file-based `readReminders` / `writeReminders` logic with Mongoose queries on the `Reminder` model.

---

## Environment Variables

For the current file-based implementation, no environment variables are required.

If you decide to use MongoDB:

- Create a `.env` file in the project root.
- Add:

```env
MONGODB_URL=your_mongodb_connection_string_here
```

`config/dB.js` already uses `dotenv/config` to load this variable.

---

## CORS & Frontend Integration

- `cors` middleware is enabled globally:
  - This allows your frontend (for example, running on a different port like `http://localhost:3000`) to call this backend without CORS issues.
- Common frontend operations:
  - Fetch all reminders from `GET /api/reminders`
  - Create reminders with `POST /api/reminders`
  - Update reminders with `PUT /api/reminders/:id`
  - Delete reminders with `DELETE /api/reminders/:id`

---

## License

This project uses the **ISC** license as specified in `package.json`.

