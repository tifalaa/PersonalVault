import { useState } from 'react';

function AddNewNote() {
  const [note, setNote] = useState("");

  const saveNote = (e) => {
    e.preventDefault();
     if (!note.trim()) return alert("Note is empty! Please write something before saving.");
    alert("Your note is: " + note);
  };

  return (
    <div className="max-w-4xl mx-auto p-6"> 
      <form onSubmit={saveNote} className="flex flex-col gap-4">
        
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">New note...</h2>

        <textarea 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="What's on your mind?"
          rows="10" 
          className="w-full text-xl leading-relaxed bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder-gray-300 text-gray-700"
        />

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-400 font-medium italic">
            {note.length > 0 ? `Characters: ${note.length}` : "Waiting..."}
          </p>
          
          <button 
            type="submit" 
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 transform hover:-translate-y-1"
          >
            Save Note
          </button>
        </div>

      </form>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <AddNewNote />
    </div>
  );
}

export default App;