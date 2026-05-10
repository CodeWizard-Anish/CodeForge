import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';
import { problemBank } from './problems';

export default function App() {
  const [viewMode, setViewMode] = useState('welcome');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [drillSnippet, setDrillSnippet] = useState(null);
  const [drillLineIndex, setDrillLineIndex] = useState(0);
  const [drillInput, setDrillInput] = useState('');
  const [drillRevealed, setDrillRevealed] = useState(false);
  const [drillFinished, setDrillFinished] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);

  const [activeProblem, setActiveProblem] = useState(null);
  const [editorLang, setEditorLang] = useState('javascript');

  const editorRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        if (viewMode === 'drill' && drillSnippet && !drillFinished) setDrillRevealed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, drillSnippet, drillFinished]);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://codeforge-api.onrender.com/api/snippets');
      const data = await res.json();
      setHistory(data);
    } catch (e) { console.error(e); }
  };

  const handleEditorDidMount = (editor) => { editorRef.current = editor; };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('codeFile', file);
    try {
      const res = await fetch('https://codeforge-api.onrender.com/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setDrillSnippet(data);
      setDrillLineIndex(0);
      setDrillInput('');
      setDrillRevealed(false);
      setDrillFinished(false);
      setCompletedLines([]);
      setOutput('');
      setViewMode('drill');
      fetchHistory();
    } catch (e) { alert('Failed to upload file.'); }
  };

  const loadHistorySnippet = (snippet) => {
    setDrillSnippet(snippet);
    setDrillLineIndex(0);
    setDrillInput('');
    setDrillRevealed(false);
    setDrillFinished(false);
    setCompletedLines([]);
    setOutput('');
    setViewMode('drill');
  };

  const handleDeleteSnippet = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`https://codeforge-api.onrender.com/api/snippets/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(s => s._id !== id));
      if (drillSnippet && drillSnippet._id === id) setViewMode('welcome');
    } catch (e) { alert('Failed to delete snippet.'); }
  };

  const loadProblem = (problem) => {
    const initialLang = Object.keys(problem.templates)[0];
    setActiveProblem(problem);
    setEditorLang(initialLang);
    setOutput('');
    setViewMode('editor');
  };

  const checkDrillCode = (input) => {
    setDrillInput(input);
    const normalize = (s) => s.replace(/\s+/g, '');
    if (normalize(input) === normalize(drillSnippet.lines[drillLineIndex])) {
      setCompletedLines(prev => [...prev, drillLineIndex]);
      if (drillLineIndex + 1 >= drillSnippet.lines.length) {
        setDrillFinished(true);
      } else {
        setDrillLineIndex(prev => prev + 1);
        setDrillInput('');
        setDrillRevealed(false);
      }
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Executing code...\n');
    try {
      let codeLinesToRun = [];
      let filenameToRun = '';

      if (viewMode === 'drill') {
        codeLinesToRun = drillSnippet.lines;
        filenameToRun = drillSnippet.title;
      } else if (viewMode === 'editor') {
        if (!editorRef.current) throw new Error('Editor not ready');
        const currentCode = editorRef.current.getValue();
        codeLinesToRun = currentCode.split('\n');
        const ext = editorLang === 'python' ? 'py' : editorLang === 'cpp' ? 'cpp' : 'js';
        filenameToRun = `solution.${ext}`;
      }

      const res = await fetch('https://codeforge-api.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeLines: codeLinesToRun,
          filename: filenameToRun,
          mode: viewMode,
          problemId: activeProblem?.id
        })
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'Process finished with no output.');
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const isErrorOutput = output.toLowerCase().includes('error') || output.toLowerCase().includes('failed');

  const langLabel = (l) => l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1);

  // Completion %
  const drillProgress = drillSnippet
    ? Math.round((drillLineIndex / drillSnippet.lines.length) * 100)
    : 0;

  return (
    <div className="app-layout">
     {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="logo-block" onClick={() => setViewMode('welcome')}>
            
            <div className="logo-text">CodeForge</div>
            <div className="logo-glow" />
          </div>
        </div>
        <div className="sidebar-divider" />
        <div className="sidebar-scroll">

          {/* Drill section */}
          <div className="sidebar-section">
            <div className="section-label">Line Drill</div>
            <label className={`upload-btn ${viewMode === 'drill' ? 'active-btn' : ''}`}>
              <span style={{ fontSize: 15 }}>⬆</span>
              Upload Code File
              <input type="file" onChange={handleFileUpload} hidden />
            </label>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="sidebar-section">
              <div className="section-label">Recent</div>
              <ul className="dsa-list">
                {history.map(snippet => (
                  <li
                    key={snippet._id}
                    className={`dsa-item ${drillSnippet?._id === snippet._id && viewMode === 'drill' ? 'active' : ''}`}
                    onClick={() => loadHistorySnippet(snippet)}
                  >
                    <span style={{ fontSize: 13, opacity: 0.7 }}>◈</span>
                    <span className="history-item-text">
                      {snippet.title}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteSnippet(e, snippet._id)}
                      title="Delete"
                    >✕</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Problem Bank */}
          <div className="sidebar-section">
            <div className="section-label">Problem Bank</div>
            <ul className="dsa-list">
              {problemBank.map(prob => (
                <li
                  key={prob.id}
                  className={`dsa-item ${activeProblem?.id === prob.id && viewMode === 'editor' ? 'active' : ''}`}
                  onClick={() => loadProblem(prob)}
                >
                  <span className={`dot ${prob.difficulty.toLowerCase()}`} />
                  {prob.title}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </aside>
              {/* ── SIDEBAR TOGGLE BUTTON ── */}
      <button 
        className={`sidebar-toggle-btn ${!isSidebarOpen ? 'collapsed' : ''}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isSidebarOpen ? '◁' : '▷'}
      </button>
      {/* ── MAIN ── */}
      <main className="main-content">

        {/* WELCOME */}
        {viewMode === 'welcome' && (
          <div className="welcome-state">
            <div className="welcome-orb">
              <div className="welcome-orb-inner" />
            </div>
            <h1 className="welcome-title">CodeForge</h1>
            <p className="welcome-sub">Your personal code gym. Drill muscle memory. Solve problems. Ship faster.</p>
            <div className="welcome-cards">
              <div className="welcome-card">
                <div className="welcome-card-icon">⚡</div>
                <div className="welcome-card-title">Line Drill</div>
                Upload any code file and type it back line by line to build real muscle memory.
              </div>
              <div className="welcome-card">
                <div className="welcome-card-icon">🧩</div>
                <div className="welcome-card-title">Problem Bank</div>
                Solve curated DSA problems with auto-graded test cases across JS, Python, C++.
              </div>
            </div>
          </div>
        )}

        {/* DRILL */}
        {viewMode === 'drill' && drillSnippet && (
          <div className="editor-container">
            {/* Header */}
            <div className="editor-header">
              <div className="traffic-lights">
                <div className="tl tl-red" />
                <div className="tl tl-yellow" />
                <div className="tl tl-green" />
              </div>
              <div className="tab-bar">
                <div className="tab active">
                  <span className="tab-dot" />
                  {drillSnippet.title}
                </div>
              </div>
              <div className="header-actions" style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                {drillFinished
                  ? <span style={{ color: 'var(--accent-emerald)' }}>✓ Complete</span>
                  : <span>{drillProgress}% &nbsp;·&nbsp; line {drillLineIndex + 1}/{drillSnippet.lines.length}</span>
                }
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: 'var(--border-dim)' }}>
              <div style={{
                height: '100%',
                width: `${drillProgress}%`,
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 12px rgba(0,212,255,0.4)'
              }} />
            </div>

            {/* Code lines */}
            <div className="editor-body drill-body">
              {drillSnippet.lines.slice(0, drillLineIndex).map((line, i) => (
                <div key={i} className="code-line">
                  <span className="line-num">{i + 1}</span>
                  <pre className={`line-done ${completedLines.includes(i) ? 'fresh' : ''}`}
                    style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{line}</pre>
                </div>
              ))}

              {!drillFinished && (
                <div className="code-line active-code-line">
                  <span className="line-num" style={{ color: 'var(--accent-cyan)' }}>{drillLineIndex + 1}</span>
                  <div className="input-area">
                    {drillRevealed && (
                      <div className="hint-bubble">
                        <span className="hint-text">{drillSnippet.lines[drillLineIndex]}</span>
                      </div>
                    )}
                    <input
                      type="text"
                      value={drillInput}
                      onChange={(e) => checkDrillCode(e.target.value)}
                      autoFocus
                      className="drill-input"
                      spellCheck="false"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Done banner */}
            {drillFinished && (
              <div className="done-banner">
                <div className="done-check">✓</div>
                All lines complete! Run to see output.
              </div>
            )}

            {/* Status bar */}
            <div className="status-bar">
              <div className="status-info">
                {!drillFinished
                  ? <span><span className="status-dot" />Drill active</span>
                  : <span><span className="status-dot" />Ready to execute</span>
                }
              </div>
              <div className="btn-group">
                {!drillFinished
                  ? <button className="btn btn-hint" onClick={() => setDrillRevealed(true)}>
                      ◎ &nbsp;Reveal Line
                    </button>
                  : <button className="btn btn-run" onClick={handleRunCode} disabled={isRunning}>
                      {isRunning ? '⏳ Running…' : '▶  Run Code'}
                    </button>
                }
              </div>
            </div>

            {/* Terminal */}
            {drillFinished && output && (
              <div className="terminal-panel">
                <div className="terminal-topbar">
                  <div className="terminal-label">
                    <div className="terminal-dot" />
                    Output
                  </div>
                </div>
                <pre className={`terminal-output ${isErrorOutput ? 'out-error' : 'out-success'}`}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* EDITOR */}
        {viewMode === 'editor' && activeProblem && (
          <div className="editor-container">
            <div className="editor-header">
              <div className="traffic-lights">
                <div className="tl tl-red" />
                <div className="tl tl-yellow" />
                <div className="tl tl-green" />
              </div>
              <div className="tab-bar">
                <div className="tab active">
                  <span className="tab-dot" />
                  {activeProblem.title}
                </div>
              </div>
              <div className="header-actions">
                <select
                  className="lang-pill"
                  value={editorLang}
                  onChange={(e) => setEditorLang(e.target.value)}
                >
                  {Object.keys(activeProblem.templates).map(lang => (
                    <option key={lang} value={lang}>{langLabel(lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="problem-desc-bar">
              <div className="desc-icon" style={{ fontSize: 11 }}>📋</div>
              <span>{activeProblem.description}</span>
            </div>

            <div className="editor-body" style={{ padding: 0 }}>
              <Editor
                key={`${activeProblem.id}-${editorLang}`}
                height="100%"
                language={editorLang}
                theme="vs-dark"
                defaultValue={activeProblem.templates[editorLang]}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  padding: { top: 18, bottom: 18 },
                  lineHeight: 1.8,
                  cursorBlinking: 'phase',
                  scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                  renderLineHighlight: 'gutter',
                  overviewRulerBorder: false,
                  hideCursorInOverviewRuler: true,
                }}
              />
            </div>

            <div className="status-bar">
              <div className="status-info">
                <span><span className="status-dot" />{langLabel(editorLang)}</span>
              </div>
              <div className="btn-group">
                <button className="btn btn-run" onClick={handleRunCode} disabled={isRunning}>
                  {isRunning ? '⏳ Running…' : '▶  Run Code'}
                </button>
              </div>
            </div>

            {output && (
              <div className="terminal-panel">
                <div className="terminal-topbar">
                  <div className="terminal-label">
                    <div className="terminal-dot" />
                    Output
                  </div>
                  <button className="terminal-close" onClick={() => setOutput('')}>clear ✕</button>
                </div>
                <pre className={`terminal-output ${isErrorOutput ? 'out-error' : 'out-success'}`}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}