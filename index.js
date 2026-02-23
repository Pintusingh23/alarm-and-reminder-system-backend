import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'reminders.json');

app.use(cors());
app.use(express.json());

// Helper: Read reminders from file
const readReminders = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

// Helper: Write reminders to file
const writeReminders = (reminders) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(reminders, null, 2));
};

// GET / — health check
app.get('/', (req, res) => {
    res.send('Alarm & Reminder API is running ✅');
});

// GET all reminders
app.get('/api/reminders', (req, res) => {
    const reminders = readReminders();
    res.json(reminders);
});

// POST — create reminder
app.post('/api/reminders', (req, res) => {
    const reminders = readReminders();
    const newReminder = {
        _id: Date.now().toString(),
        title: req.body.title,
        note: req.body.note || '',
        datetime: req.body.datetime,
        status: req.body.status || 'scheduled',
        enabled: req.body.enabled !== undefined ? req.body.enabled : true,
        createdAt: new Date().toISOString()
    };
    reminders.push(newReminder);
    writeReminders(reminders);
    res.status(201).json(newReminder);
});

// PUT — update reminder
app.put('/api/reminders/:id', (req, res) => {
    const reminders = readReminders();
    const index = reminders.findIndex(r => r._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Reminder not found' });
    }

    // Merge updates (only update provided fields)
    const updated = {
        ...reminders[index],
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.note !== undefined && { note: req.body.note }),
        ...(req.body.datetime !== undefined && { datetime: req.body.datetime }),
        ...(req.body.status !== undefined && { status: req.body.status }),
        ...(req.body.enabled !== undefined && { enabled: req.body.enabled }),
    };

    reminders[index] = updated;
    writeReminders(reminders);
    res.json(updated);
});

// DELETE — delete reminder
app.delete('/api/reminders/:id', (req, res) => {
    const reminders = readReminders();
    const filtered = reminders.filter(r => r._id !== req.params.id);
    if (filtered.length === reminders.length) {
        return res.status(404).json({ message: 'Reminder not found' });
    }
    writeReminders(filtered);
    res.json({ message: 'Reminder deleted' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Data stored in: ${DATA_FILE}`);
});