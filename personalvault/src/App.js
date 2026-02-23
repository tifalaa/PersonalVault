import { useState } from 'react';

function AddNewNote({ onSave }) {
  const [note, setNote] = useState("");

  const saveNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return alert("Note is empty!");

    onSave(note); 
    setNote(""); 
    alert("Saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6"> 
      <form onSubmit={saveNote} className="flex flex-col gap-4 cursor-default">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">New note...</h2>
        <textarea 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="What's on your mind?"
          rows="10" 
          className="w-full text-xl leading-relaxed bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 text-gray-700"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-400 font-medium italic">
            {note.length > 0 ? `Characters: ${note.length}` : "Waiting..."}
          </p>
          <button 
            type="submit" 
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [shownote, setshownote] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const addNoteToList = (text) => {
    setAllNotes([...allNotes, text]);
  };

  return (
    <div className="min-h-screen bg-gray-200 pt-12">
      <button 
        onClick={() => setshownote(true)} 
        className="ml-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-black transition-colors"
      >
        All notes ({allNotes.length})
      </button>

      <AddNewNote onSave={addNoteToList} />

      {shownote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <div className="flex justify-center gap-4 p-4">
              <button 
                onClick={() => setshownote(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
              >
                ✕
              </button>
              <button 
                className="bg-red-500 rounded-2xl hover:bg-red-600 border-2 border-solid border-red-500 absolute top-4 right-24 text-white font-bold text-xl px-6 py-2" 
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedId(null);
                }}
              >
                {selectMode ? "Cancel" : "Select notes"}
              </button>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Vault</h2>
            
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase">
                  <th className="py-2">Note Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allNotes.length === 0 ? (
                  <tr>
                    <td className="py-10 text-center text-gray-400 italic">No notes in the vault yet...</td>
                  </tr>
                ) : (
                  allNotes.map((item, index) => (
                    <tr 
                      key={index} 
                      onClick={() => selectMode && setSelectedId(index)} 
                      className={`cursor-pointer transition-colors ${selectMode && selectedId === index ? "bg-blue-100" : "bg-white"}`}
                    >
                      <td className="py-4 px-4 text-gray-700 leading-relaxed">
                        {item}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;