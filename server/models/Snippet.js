import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  lines: { 
    type: [String], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '30d' // <-- THE MAGIC LINE: Auto-deletes after 30 days!
  }
});

export default mongoose.model('Snippet', snippetSchema);