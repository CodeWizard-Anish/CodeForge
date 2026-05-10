import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Snippet from './models/Snippet.js';
import axios from 'axios';

// Load the secret variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// --- STRICT CORS POLICY ---
const corsOptions = {
  origin: ['http://localhost:5173', 'https://code-forge-wine.vercel.app'], 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());

// --- CONNECT TO MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const upload = multer({ dest: 'uploads/' });

// ==========================================
// 1. UPLOAD ENDPOINT (Restored!)
// ==========================================
app.post('/api/upload', upload.single('codeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the file the user just uploaded
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    
    // Split the file into an array of lines (removing weird Windows carriage returns)
    const lines = fileContent.split('\n').map(line => line.replace(/\r/g, ''));

    // Save to MongoDB
    const newSnippet = new Snippet({
      title: req.file.originalname,
      lines: lines
    });
    await newSnippet.save();
    console.log("💾 Saved to Database:", req.file.originalname);

    // Delete the temporary file from the Render server so it doesn't clutter
    fs.unlinkSync(req.file.path);

    res.json(newSnippet);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to process uploaded file." });
  }
});

// ==========================================
// 2. EXECUTION ENDPOINT (Fixed JDoodle URL)
// ==========================================
app.post('/api/execute', async (req, res) => {
  try {
    const { codeLines, filename } = req.body;
    let codeContent = codeLines.join('\n');

    // Detect the language from the file extension
    const ext = filename.split('.').pop();
    let language = 'nodejs'; 
    let versionIndex = '4'; // Node.js v17

    // Map languages and secretly inject required LeetCode-style imports
    if (ext === 'py') {
      language = 'python3';
      versionIndex = '4'; // Python 3.9
      codeContent = "from typing import *\n" + codeContent; 
      
    } else if (ext === 'cpp') {
      language = 'cpp17';
      versionIndex = '1'; // C++ 17
      codeContent = "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n" + codeContent;
    }

    // Send the code securely to the ACTUAL JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: process.env.JDOODLE_CLIENT_ID,         
      clientSecret: process.env.JDOODLE_CLIENT_SECRET, 
      script: codeContent,
      language: language,
      versionIndex: versionIndex
    });

    const data = response.data;

    // Handle JDoodle's specific response structure and send back to React
    if (data.output) {
      res.json({ output: data.output });
    } else if (data.error) {
      res.json({ error: `JDoodle Error: ${data.error}` });
    } else {
      res.json({ output: "Code executed successfully with no output." });
    }

  } catch (error) {
    console.error("Execution Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to connect to execution engine." });
  }
});

// ==========================================
// 3. HISTORY ENDPOINT
// ==========================================
app.get('/api/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ==========================================
// 4. DELETE ENDPOINT
// ==========================================
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    console.log("🗑️ Deleted from Database:", req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("Failed to delete snippet:", error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));