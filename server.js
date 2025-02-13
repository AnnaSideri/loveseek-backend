require('dotenv').config();
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

// Sikrer at ADC-variabelen er satt riktig
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
console.error("❌ Feil: GOOGLE_APPLICATION_CREDENTIALS er ikke satt.");
process.exit(1);
}

// Initialiser Firebase med privat nøkkel
admin.initializeApp({
credential: admin.credential.applicationDefault()
});

const db = getFirestore();
const app = express();

// Middleware
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

// Endepunkt for å sende meldinger
app.post('/api/send-message', async (req, res) => {
try {
const { username, message } = req.body;
if (!username || !message) {
return res.status(400).json({ success: false, error: "Mangler 'username' eller 'message'." });
}

    const timestamp = new Date();
    await db.collection('messages').add({ username, message, timestamp });
    
    pusher.trigger('chat_channel', 'new_message', { username, message });
    
    res.json({ success: true });
} catch (error) {
    console.error('❌ Feil ved sending av melding:', error);
    res.status(500).json({ success: false, error: error.message });
}

});

// Start server med /api-prefix
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(🚀 Server running on port ${PORT}));