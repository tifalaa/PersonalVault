import { useEffect, useState } from 'react';

const CATEGORIES = ["All", "School", "Work", "Personal", "Other"];

const CATEGORY_STYLES = {
  School: { bg: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  Work:   { bg: "#1a3a2a", text: "#4ade80", dot: "#22c55e" },
  Personal: { bg: "#3b1f2b", text: "#f472b6", dot: "#ec4899" },
  Other:  { bg: "#2a2a2a", text: "#a3a3a3", dot: "#737373" },
};

function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

  
    document.body.style.backgroundColor = '#202028';
    document.body.style.margin = '0';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  return null;
}

function CategoryPill({ category }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.05em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: style.dot, display: 'inline-block' }} />
      {category}
    </span>
  );
}

function AddNewNote({ onSave, editData }) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Other");

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
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          marginBottom: 10,
        }}>
          ✦ My Vault
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 52,
          fontWeight: 900,
          color: '#fafaf9',
          margin: 0,
          lineHeight: 1.1,
        }}>
          What's on<br />your mind?
        </h1>
      </div>

      {/* Textarea */}
      <form onSubmit={saveNote}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start writing..."
          rows={8}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#46465D',
            border: '1px solid #2a2a35',
            borderRadius: 16,
            padding: '24px 28px',
            color: '#e8e8e4',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 17,
            lineHeight: 1.75,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#f59e0b'}
          onBlur={e => e.target.style.borderColor = '#2a2a35'}
        />

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BEBECB', fontStyle: 'italic' }}>
              {note.length > 0 ? `${note.length} chars` : 'Waiting...'}
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                backgroundColor: '#46465D',
                border: '1px solid #2a2a35',
                borderRadius: 8,
                padding: '6px 12px',
                color: '#D6D6E0',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#f59e0b',
              color: '#0c0c0f',
              border: 'none',
              borderRadius: 10,
              padding: '12px 28px',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Save Note →
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [shownote, setshownote] = useState(false);
  const [allNotes, setAllNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectMode, setSelectMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editNote, setEditNote] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(allNotes));
  }, [allNotes]);

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const addNoteToList = (text, category) => {
    if (editNote) {
      setAllNotes(allNotes.map((note, i) => i === selectedId ? { ...note, text, category } : note));
      setEditNote(false);
      setSelectedId(null);
      return;
    }
    setAllNotes([...allNotes, { text, category, createdAt: getFormattedDate() }]);
  };

  const deleteSelectedNote = () => {
    if (selectedId == null) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setAllNotes(allNotes.filter((_, i) => i !== selectedId));
    setSelectedId(null);
    setSelectMode(false);
  };

  const filteredNotes = activeCategory === "All"
    ? allNotes
    : allNotes.filter(n => n.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0c0c0f' }}>
      <FontLoader />

      {/* Top nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '20px 28px',
        borderBottom: '1px solid #1a1a22',
      }}>
        <button
          onClick={() => setshownote(true)}
          style={{
            backgroundColor: '#f59e0b',
            border: '1px solid #2a2a35',
            borderRadius: 8,
            padding: '8px 18px',
            color: '0c0c0f',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.color = '#d98b09'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#2a2a35'; e.target.style.color = '#0c0c0f'; }}
        >
          View vault ({allNotes.length})
        </button>
      </div>

      <AddNewNote
        onSave={addNoteToList}
        editData={editNote ? allNotes[selectedId] : null}
      />

      {/* Modal */}
      {shownote && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: 16,
        }}>
          <div style={{
            backgroundColor: '#13131a',
            border: '1px solid #22222e',
            borderRadius: 20,
            width: '100%',
            maxWidth: 640,
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#fafaf9',
                margin: 0,
              }}>
                My Vault
              </h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {selectMode && selectedId !== null && (
                  <>
                    <button onClick={deleteSelectedNote} style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}>
                      Delete
                    </button>
                    <button onClick={() => { setEditNote(true); setshownote(false); setSelectMode(false); }} style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #3b82f6',
                      color: '#3b82f6',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}>
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setSelectMode(!selectMode); setSelectedId(null); }}
                  style={{
                    backgroundColor: selectMode ? '#2a2a35' : 'transparent',
                    border: '1px solid #2a2a35',
                    color: '#a3a3a3',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {selectMode ? 'Cancel' : 'Select'}
                </button>
                <button
                  onClick={() => setshownote(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#555',
                    fontSize: 20,
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    backgroundColor: activeCategory === c ? '#f59e0b' : '#1a1a22',
                    color: activeCategory === c ? '#0c0c0f' : '#777',
                    border: 'none',
                    borderRadius: 999,
                    padding: '5px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 12,
                    fontWeight: activeCategory === c ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Notes list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredNotes.length === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: '#444',
                  fontFamily: 'DM Sans, sans-serif',
                  fontStyle: 'italic',
                  padding: '40px 0',
                  fontSize: 14,
                }}>
                  No notes here yet...
                </p>
              ) : (
                filteredNotes.map((item) => {
                  const realIndex = allNotes.indexOf(item);
                  const isSelected = selectMode && selectedId === realIndex;
                  return (
                    <div
                      key={realIndex}
                      onClick={() => selectMode && setSelectedId(realIndex)}
                      style={{
                        backgroundColor: isSelected ? '#1e1e2e' : '#16161d',
                        border: `1px solid ${isSelected ? '#f59e0b' : '#22222e'}`,
                        borderRadius: 12,
                        padding: '16px 20px',
                        cursor: selectMode ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                      }}
                    >
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 14,
                        color: '#d4d4d0',
                        margin: '0 0 10px',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {item.text}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <CategoryPill category={item.category} />
                        <span style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 11,
                          color: '#444',
                          fontStyle: 'italic',
                        }}>
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;