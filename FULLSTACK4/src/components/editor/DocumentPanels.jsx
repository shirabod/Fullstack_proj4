import React from 'react';

export default function DocumentPanels({
  openDocs,
  activeDocId,
  setActiveDocId,
  handleUndo,
  handleRedo,
  handleClear,
  handleCloseDoc,
  handleEditorMouseUp,
  handleEditorClick,
  caretIndex,
  hasSelection,
  isSelectedIndex,
  handleCharMouseDown,
  handleCharMouseEnter
}) {
  return (
    <div className="flex-1 p-3 md:p-4 flex gap-4 overflow-x-auto bg-gray-100" dir="rtl">
      {openDocs.map((doc) => {
        const isActive = doc.id === activeDocId;
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
              dir="auto"
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              onMouseUp={handleEditorMouseUp}
              onMouseLeave={handleEditorMouseUp}
              onClick={handleEditorClick}
            >
              {doc.content.map((el, index) => (
                <React.Fragment key={el.id}>
                  {isActive && caretIndex === index && !hasSelection && (
                    <span className="animate-pulse border-r-2 border-blue-500 ml-[1px] inline-block h-[1em] align-middle"></span>
                  )}
                  <span
                    data-char-index={index}
                    onMouseDown={(e) => isActive && handleCharMouseDown(e, index)}
                    onMouseEnter={() => isActive && handleCharMouseEnter(index)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: el.color,
                      fontSize: `${el.fontSize}px`,
                      fontFamily: el.fontFamily,
                      backgroundColor: isActive && isSelectedIndex(index) ? '#BFDBFE' : 'transparent',
                      borderRadius: isActive && isSelectedIndex(index) ? '3px' : '0px'
                    }}
                  >
                    {el.char}
                  </span>
                </React.Fragment>
              ))}
              {isActive && caretIndex === doc.content.length && !hasSelection && (
                <span className="animate-pulse border-r-2 border-blue-500 ml-[2px] inline-block h-[1em] align-middle"></span>
              )}
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
