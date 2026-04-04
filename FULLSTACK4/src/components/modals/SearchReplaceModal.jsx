import React from 'react';

export default function SearchReplaceModal({
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
    <div className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none" dir="rtl">
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
                className={`w-full border rounded p-2 outline-none ${virtualInputTarget === 'search' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'}`}
              />
              <button
                onClick={onFocusSearch}
                className={`px-3 rounded border font-bold ${virtualInputTarget === 'search' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
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
                className={`w-full border rounded p-2 outline-none ${virtualInputTarget === 'replace' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'}`}
              />
              <button
                onClick={onFocusReplace}
                className={`px-3 rounded border font-bold ${virtualInputTarget === 'replace' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                title="הקלדה מהמקלדת הווירטואלית לשדה זה"
              >
                🎯
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">סגור</button>
          <button onClick={onSearchOnly} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 font-medium">חפש הבא</button>
          <button onClick={onReplaceAll} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">החלף הכל</button>
        </div>
      </div>
    </div>
  );
}
