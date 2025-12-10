const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { connectToDB, sql } = require('./db');

// Initialize express app
const app = express();

// Port for backend server
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ POST: Save a new tip calculation
// POST endpoint
app.post('/api/tips', async (req, res) => {
  const { billAmount, tipPercent, numberOfPeople, totalTip, totalAmount } = req.body;

  try {
    await connectToDB(); // ✅ Connects to SQL Server

    // ✅ Inserts values into the TipLogs table
    await sql.query`
      INSERT INTO TipLogs (billAmount, tipPercent, numberOfPeople, totalTip, totalAmount)
      VALUES (${billAmount}, ${tipPercent}, ${numberOfPeople}, ${totalTip}, ${totalAmount})
    `;

    res.status(201).json({ message: 'Tip saved successfully' });
  } catch (err) {
    console.error('Error saving tip:', err);
    res.status(500).json({ error: 'Failed to save tip' });
  }
});

// ✅ GET: Retrieve all tip entries
app.get('/api/tips', async (req, res) => {
  try {
    await connectToDB();

    // Fetch all the tip logs
    const result = await sql.query`SELECT * FROM TipLogs ORDER BY createdAt DESC`;
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching tips:', err);
    res.status(500).json({ error: 'Failed to retrieve tips' });
  }
});

// ✅ DELETE: Delete a specific tip entry by ID
app.delete('/api/tips/:id', async (req, res) => {
  const tipId = req.params.id;

  try {
    await connectToDB();

    // Delete tip entry based on the given ID
    const result = await sql.query`DELETE FROM TipLogs WHERE id = ${tipId}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (err) {
    console.error('Error deleting tip:', err);
    res.status(500).json({ error: 'Failed to delete tip' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
