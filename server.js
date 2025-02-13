// Oppdatert server.js for å fikse SyntaxError
require('dotenv').config();
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Sjekk ADC-konfigurasjon
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
console.error("❌ Feil: GOOGLE_APPLICATION_CREDENTIALS er ikke satt.");
process.exit(1);
}

// Initialiser Firebase med ADC
admin.initializeApp({
credential: admin.credential.applicationDefault()
});
const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurer Pusher
const pusher = new Pusher({
appId: process.env.PUSHER_APP_ID,
key: process.env.PUSHER_KEY,
secret: process.env.PUSHER_SECRET,
cluster: process.env.PUSHER_CLUSTER,
useTLS: true
});

// API-endepunkt for å sende meldinger
app.post('/api/send-message', async (req, res) => {
try {
const { username, message } = req.body;
if (!username || !message) {
return res.status(400).json({ success: false, error: "Mangler 'username' eller 'message'." });
}

    await db.collection('messages').add({
        username,
        message,
        timestamp: new Date()
    });

    pusher.trigger('chat_channel', 'new_message', { username, message });
    res.json({ success: true });
} catch (error) {
    console.error('❌ Feil ved sending:', error);
    res.status(500).json({ success: false, error: error.message });
}

});

// Start serveren med riktig log-melding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));