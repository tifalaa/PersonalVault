import { useEffect, useState } from 'react';

const CATEGORIES = ["All", "School", "Work", "Personal", "Other"];

function AddNewNote({ onSave, editData }) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("ostalo");

  useEffect(() => {
    if (editData) {
      setNote(editData.text);
      setCategory(editData.category);
    }
  }, [editData]);

  const saveNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return alert("Note is empty!");
    onSave(note, category); 
    setNote("");
    setCategory("Other");
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
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400 font-medium italic">
              {note.length > 0 ? `Characters: ${note.length}` : "Waiting..."}
            </p>
            {/* Dropdown za odabir kategorije */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 bg-white focus:border-indigo-400 outline-none"
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
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
  const [editNote, setEditNote] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All"); // koja kategorija je aktivna u filteru

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addNoteToList = (text, category) => {
    if (editNote) {
      const updatedNotes = allNotes.map((note, index) =>
        index === selectedId ? { ...note, text, category } : note
      );
      setAllNotes(updatedNotes);
      setEditNote(false);
      setSelectedId(null);
      return;
    }
    setAllNotes([...allNotes, { text, category, createdAt: getFormattedDate() }]);
  };

  const deleteSelectedNote = () => {
    if (selectedId == null) return;
    const updatedNotes = allNotes.filter((_, index) => index !== selectedId);
    setAllNotes(updatedNotes);
    setSelectedId(null);
    setSelectMode(false);
  };

  // Filtriramo bilješke ovisno o odabranoj kategoriji
  const filteredNotes = activeCategory === "All"
    ? allNotes
    : allNotes.filter(n => n.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-200 pt-12">
      <button
        onClick={() => setshownote(true)}
        className="ml-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-black transition-colors"
      >
        All notes ({allNotes.length})
      </button>

      <AddNewNote
        onSave={addNoteToList}
        editData={editNote ? allNotes[selectedId] : null}
      />

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
                {selectMode ? "Cancel" : "Select a note"}
              </button>
              {selectMode && selectedId !== null && (
                <>
                  <button
                    onClick={deleteSelectedNote}
                    className="bg-white border-2 border-red-500 text-red-500 rounded-2xl font-bold text-xl px-6 py-2 absolute top-4 left-4 hover:bg-red-50 transition-colors"
                  >
                    Delete Note
                  </button>
                  <button
                    onClick={() => {
                      setEditNote(true);
                      setshownote(false);
                      setSelectMode(false);
                    }}
                    className="bg-blue-500 border-2 border-blue-500 text-white rounded-2xl font-bold text-xl px-6 py-2 absolute top-4 left-48 hover:bg-blue-600 transition-colors"
                  >
                    Edit Note
                  </button>
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">My Vault</h2>

            {/* Filter dugmad po kategorijama */}
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === c
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase">
                  <th className="py-2">Note Content</th>
                  <th className="py-2">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-10 text-center text-gray-400 italic">
                      No notes in the vault yet...
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((item) => {
                    // Trebamo pravi index u allNotes jer filteredNotes može biti podskup
                    const realIndex = allNotes.indexOf(item);
                    return (
                      <tr
                        key={realIndex}
                        onClick={() => selectMode && setSelectedId(realIndex)}
                        className={`cursor-pointer transition-colors ${
                          selectMode && selectedId === realIndex ? "bg-blue-100" : "bg-white"
                        }`}
                      >
                        <td className="py-4 px-4 text-gray-700 leading-relaxed">
                          <div>{item.text}</div>
                          <div className="text-xs text-gray-400 mt-1">{item.createdAt}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {item.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })
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