import React from 'react';

export function SaveModal({
  isOpen,
  filenameInput,
  onFilenameChange,
  onFilenameFocus,
  virtualInputTarget,
  onCancel,
  onConfirm,
  isClosingDoc
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none"
      dir="rtl"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl pointer-events-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">שמור מסמך בשם</h2>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={filenameInput}
            onChange={(e) => onFilenameChange(e.target.value)}
            onFocus={onFilenameFocus}
            onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
            placeholder="הקלד שם למסמך..."
            className={`w-full border-2 outline-none p-2 rounded text-gray-800 ${
              virtualInputTarget === 'saveName' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'
            }`}
            autoFocus
          />
          <button
            onClick={onFilenameFocus}
            className={`px-3 rounded border font-bold ${
              virtualInputTarget === 'saveName' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'
            }`}
            title="הקלדה מהמקלדת הווירטואלית לשדה זה"
          >
            🎯
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">
            ביטול
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
            שמור {isClosingDoc ? 'וסגור' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadModal({ isOpen, currentUser, savedFilesList, onLoadFile, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none"
      dir="rtl"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl pointer-events-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">טען מסמך של {currentUser}</h2>
        <div className="max-h-60 overflow-y-auto mb-6 border border-gray-200 rounded p-2">
          {savedFilesList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">אין מסמכים שמורים עדיין 📄</p>
          ) : (
            savedFilesList.map((name) => (
              <button
                key={name}
                onClick={() => onLoadFile(name)}
                className="w-full text-right p-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition text-gray-700 font-medium flex items-center gap-2"
              >
                <span className="text-blue-500">📄</span> {name}
              </button>
            ))
          )}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchReplaceModal({
  isOpen,
  searchTarget,
  replaceWith,
  virtualInputTarget,
  onSearchChange,
  onReplaceChange,
  onFocusSearch,
  onFocusReplace,
  onClose,
  onSearchOnly,
  onReplaceAll
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none"
      dir="rtl"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl pointer-events-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">חיפוש והחלפה</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">טקסט לחיפוש</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTarget}
                onFocus={onFocusSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full border rounded p-2 outline-none ${
                  virtualInputTarget === 'search' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              <button
                onClick={onFocusSearch}
                className={`px-3 rounded border font-bold ${
                  virtualInputTarget === 'search' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}
                title="הקלדה מהמקלדת הווירטואלית לשדה זה"
              >
                🎯
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">החלף ב-</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={replaceWith}
                onFocus={onFocusReplace}
                onChange={(e) => onReplaceChange(e.target.value)}
                className={`w-full border rounded p-2 outline-none ${
                  virtualInputTarget === 'replace' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              <button
                onClick={onFocusReplace}
                className={`px-3 rounded border font-bold ${
                  virtualInputTarget === 'replace' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}
                title="הקלדה מהמקלדת הווירטואלית לשדה זה"
              >
                🎯
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">
            סגור
          </button>
          <button onClick={onSearchOnly} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 font-medium">
            חפש הבא
          </button>
          <button onClick={onReplaceAll} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
            החלף הכל
          </button>
        </div>
      </div>
    </div>
  );
}
