import React from 'react';

const buildRenderNodes = (content, showCaret, caretIndex) => {
  const nodes = [];

  const pushCaret = () => {
    nodes.push({ type: 'caret', key: `caret-${nodes.length}` });
  };

  const pushChar = (el, index) => {
    if (el.char === '\n') {
      nodes.push({ type: 'newline', key: `nl-${el.id}-${index}` });
      return;
    }

    nodes.push({
      type: 'char',
      key: `char-${el.id}-${index}`,
      text: el.char,
      color: el.color,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily
    });
  };

  for (let i = 0; i < content.length; i++) {
    if (showCaret && caretIndex === i) {
      pushCaret();
    }
    pushChar(content[i], i);
  }

  if (showCaret && caretIndex === content.length) {
    pushCaret();
  }

  return nodes;
};

export default function DocumentPanels({
  openDocs,
  activeDocId,
  setActiveDocId,
  handleUndo,
  handleRedo,
  handleClear,
  handleCloseDoc,
  handleEditorClick,
  caretIndex,
  currentLang
}) {
  const baseDir = currentLang === 'HEB' ? 'rtl' : 'ltr';
  const caretAnchorChar = baseDir === 'rtl' ? '\u200F' : '\u200E';

  return (
    <div className="flex-1 p-3 md:p-4 flex gap-4 overflow-x-auto bg-gray-100" dir="rtl">
      {openDocs.map((doc) => {
        const isActive = doc.id === activeDocId;
        const renderNodes = buildRenderNodes(doc.content, isActive, caretIndex);
        return (
          <div
            key={doc.id}
            onClick={() => setActiveDocId(doc.id)}
            className={`flex flex-col flex-1 min-w-[300px] max-w-[100%] md:max-w-full bg-white rounded-lg shadow-md transition-all duration-200 ${
              isActive ? 'ring-4 ring-blue-400 scale-[1.01] z-10' : 'opacity-80 hover:opacity-100 cursor-pointer'
            }`}
          >
            <div className={`p-2 px-3 flex justify-between items-center border-b rounded-t-lg ${isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <span className={`font-bold truncate pr-1 flex items-center gap-2 ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>
                {doc.isDraft ? '📝' : '📄'} {doc.name} {doc.isDirty && '*'}
                {isActive && (
                  <div className="flex gap-1 ml-4 border-r border-blue-200 pr-2">
                    <button onClick={(e) => { e.stopPropagation(); handleUndo(); }} disabled={doc.historyIndex <= 0} className={`p-1 rounded ${doc.historyIndex <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`} title="Undo">↶</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRedo(); }} disabled={doc.historyIndex >= doc.history.length - 1} className={`p-1 rounded ${doc.historyIndex >= doc.history.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`} title="Redo">↷</button>
                  </div>
                )}
              </span>

              <div className="flex gap-1">
                {isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                    title="נקה מסמך"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={(e) => handleCloseDoc(e, doc.id)}
                  className="p-1 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded transition"
                  title="סגור אזור"
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              className={`flex-1 p-4 overflow-y-auto outline-none leading-tight ${isActive ? 'cursor-text' : 'cursor-pointer'}`}
              dir={baseDir}
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', unicodeBidi: 'isolate', textAlign: 'start', direction: baseDir }}
              onClick={handleEditorClick}
            >
              {renderNodes.map((node) => {
                if (node.type === 'caret') {
                  return (
                    <span
                      key={node.key}
                      className="animate-pulse inline-block h-[1em] align-middle"
                      style={{ borderInlineEnd: '2px solid #3b82f6', marginInline: '1px' }}
                    >
                      {caretAnchorChar}
                    </span>
                  );
                }

                if (node.type === 'newline') {
                  return <br key={node.key} />;
                }

                return (
                  <span
                    key={node.key}
                    dir="auto"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: node.color,
                      fontSize: `${node.fontSize}px`,
                      fontFamily: node.fontFamily,
                      unicodeBidi: 'isolate'
                    }}
                  >
                    {node.text}
                  </span>
                );
              })}
              {!isActive && doc.content.length === 0 && (
                <span className="text-gray-300 text-sm">לחץ כאן כדי להתחיל לכתוב...</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
