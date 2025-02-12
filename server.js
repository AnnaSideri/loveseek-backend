require('dotenv').config();
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Bruk ADC i stedet for en privat nøkkel
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

// Endepunkt for å sende meldinger
app.post('/send-message', async (req, res) => {
  try {
    const { username, message } = req.body;
    const timestamp = new Date();

    // Lagre meldingen i Firestore
    await db.collection('messages').add({
      username,
      message,
      timestamp
    });

    // Send melding via Pusher
    pusher.trigger('chat_channel', 'new_message', {
      username,
      message
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Feil ved sending av melding:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
