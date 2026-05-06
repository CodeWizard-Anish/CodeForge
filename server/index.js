import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Snippet from './models/Snippet.js'; // Import your new database model
import axios from 'axios';
// Load the secret variables from the .env file
dotenv.config();

const app = express();
const port = 5000;
const execPromise = promisify(exec);

app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const upload = multer({ dest: 'uploads/' });

// --- THE AUTOMATED GRADING ENGINE ---
const testHarness = {
  'p1': { // Two Sum
    'js': (code) => `
${code}
// --- HIDDEN TEST RUNNER ---
try {
  let passed = 0;
  console.log("Running Test Cases...\\n");
  
  const t1 = twoSum([2, 7, 11, 15], 9);
  if (t1 && t1[0]===0 && t1[1]===1) { console.log("✅ Test 1 Passed: [2,7,11,15], target=9"); passed++; } 
  else { console.log("❌ Test 1 Failed. Expected [0,1], Got: [" + t1 + "]"); }

  const t2 = twoSum([3, 2, 4], 6);
  if (t2 && t2[0]===1 && t2[1]===2) { console.log("✅ Test 2 Passed: [3,2,4], target=6"); passed++; } 
  else { console.log("❌ Test 2 Failed. Expected [1,2], Got: [" + t2 + "]"); }

  const t3 = twoSum([3, 3], 6);
  if (t3 && t3[0]===0 && t3[1]===1) { console.log("✅ Test 3 Passed: [3,3], target=6"); passed++; } 
  else { console.log("❌ Test 3 Failed. Expected [0,1], Got: [" + t3 + "]"); }

  console.log(\`\\n🏆 Result: \${passed}/3 Test Cases Passed\`);
  if (passed === 3) console.log("Status: ACCEPTED");
} catch(e) { console.log("Execution Error: " + e.message); }
`,
    'py': (code) => `
from typing import List
${code}
# --- HIDDEN TEST RUNNER ---
if __name__ == "__main__":
    try:
        passed = 0
        print("Running Test Cases...\\n")
        
        t1 = twoSum([2, 7, 11, 15], 9)
        if t1 == [0, 1]:
            print("✅ Test 1 Passed: [2,7,11,15], target=9")
            passed += 1
        else:
            print(f"❌ Test 1 Failed. Expected [0, 1], Got: {t1}")
            
        t2 = twoSum([3, 2, 4], 6)
        if t2 == [1, 2]:
            print("✅ Test 2 Passed: [3,2,4], target=6")
            passed += 1
        else:
            print(f"❌ Test 2 Failed. Expected [1, 2], Got: {t2}")
            
        t3 = twoSum([3, 3], 6)
        if t3 == [0, 1]:
            print("✅ Test 3 Passed: [3,3], target=6")
            passed += 1
        else:
            print(f"❌ Test 3 Failed. Expected [0, 1], Got: {t3}")

        print(f"\\n🏆 Result: {passed}/3 Test Cases Passed")
        if passed == 3:
            print("Status: ACCEPTED")
    except Exception as e:
        print(f"Execution Error: {e}")
`,
    'cpp': (code) => `
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;
${code}
// --- HIDDEN TEST RUNNER ---
int main() {
    int passed = 0;
    cout << "Running Test Cases...\\n\\n";
    
    try {
        vector<int> t1_nums = {2, 7, 11, 15};
        vector<int> t1 = twoSum(t1_nums, 9);
        if(t1.size() == 2 && t1[0] == 0 && t1[1] == 1) { cout << "✅ Test 1 Passed\\n"; passed++; }
        else { cout << "❌ Test 1 Failed\\n"; }

        vector<int> t2_nums = {3, 2, 4};
        vector<int> t2 = twoSum(t2_nums, 6);
        if(t2.size() == 2 && t2[0] == 1 && t2[1] == 2) { cout << "✅ Test 2 Passed\\n"; passed++; }
        else { cout << "❌ Test 2 Failed\\n"; }

        vector<int> t3_nums = {3, 3};
        vector<int> t3 = twoSum(t3_nums, 6);
        if(t3.size() == 2 && t3[0] == 0 && t3[1] == 1) { cout << "✅ Test 3 Passed\\n"; passed++; }
        else { cout << "❌ Test 3 Failed\\n"; }

        cout << "\\n🏆 Result: " << passed << "/3 Test Cases Passed\\n";
        if(passed == 3) cout << "Status: ACCEPTED\\n";
    } catch(...) { cout << "Execution Error\\n"; }
    return 0;
}
`
  }
};

// 1. Upload Endpoint (Now Saves to MongoDB!)
app.post('/api/execute', async (req, res) => {
  try {
    const { codeLines, filename } = req.body;
    const codeContent = codeLines.join('\n');
    const ext = filename.split('.').pop();
    
    // JDoodle uses specific language identifiers
    let language = 'nodejs'; 
    let versionIndex = '4'; // Node.js version 17

    if (ext === 'py') {
      language = 'python3';
      versionIndex = '4'; // Python 3.9
    } else if (ext === 'cpp') {
      language = 'cpp17';
      versionIndex = '1'; // C++ 17
    }

    // Send to JDoodle
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: '1f1de56b9ef5de6939b8e72ccda12e81',         // <--- Put your ID here
      clientSecret: '9708c55a1c4358a99ccef04f67cf305bf50b0f52fe533655ff6c91d82ebe3f97', // <--- Put your Secret here
      script: codeContent,
      language: language,
      versionIndex: versionIndex
    });

    const data = response.data;
    
    console.log("\n--- JDOODLE API RESPONSE ---");
    console.log(data);
    console.log("----------------------------\n");

    // JDoodle puts the console text inside 'output'
    if (data.output) {
      res.json({ output: data.output });
    } else {
      res.json({ error: `JDoodle Error: ${data.error}` });
    }

  } catch (error) {
    console.error("Execution Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to connect to execution engine." });
  }
});

// 2. Execution Endpoint
// Remove any Docker or child_process imports at the top of your file!

app.post('/api/execute', async (req, res) => {
  try {
    const { codeLines, filename } = req.body;
    let codeContent = codeLines.join('\n');

    // 1. Detect the language from the file extension
    const ext = filename.split('.').pop();
    let language = 'nodejs'; 
    let versionIndex = '4'; // Node.js v17

    // 2. Map languages and secretly inject required LeetCode-style imports
    if (ext === 'py') {
      language = 'python3';
      versionIndex = '4'; // Python 3.9
      // Inject standard Python typing for lists, dictionaries, etc.
      codeContent = "from typing import *\n" + codeContent; 
      
    } else if (ext === 'cpp') {
      language = 'cpp17';
      versionIndex = '1'; // C++ 17
      // Inject standard C++ headers and namespace
      codeContent = "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n" + codeContent;
    }

    // 3. Send the code securely to the JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: '1f1de56b9ef5de6939b8e72ccda12e81',         // <--- Replace this!
      clientSecret: '9708c55a1c4358a99ccef04f67cf305bf50b0f52fe533655ff6c91d82ebe3f97', // <--- Replace this!
      script: codeContent,
      language: language,
      versionIndex: versionIndex
    });

    const data = response.data;
    
    // Optional: Keep this console.log if you want to see exactly what JDoodle returns in your terminal
    // console.log("\n--- JDOODLE API RESPONSE ---", data, "\n----------------------------\n");

    // 4. Handle JDoodle's specific response structure and send back to React
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
// --- HISTORY ENDPOINT (Get all past uploads) ---
app.get('/api/snippets', async (req, res) => {
  try {
    // Fetch all snippets and sort them by newest first
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// --- DELETE ENDPOINT (Trash Can) ---
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

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));