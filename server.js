const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Softr Test Endpoint
app.get('/api/test-softr', (req, res) => {
    res.json({ success: true, message: "✅ Hei Softr, backend svarer!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Softr Test Server running on port ${PORT}`));
