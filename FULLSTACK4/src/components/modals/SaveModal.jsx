import React from 'react';

export default function SaveModal({
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
    <div className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none" dir="rtl">
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
            className={`w-full border-2 outline-none p-2 rounded text-gray-800 ${virtualInputTarget === 'saveName' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 focus:border-blue-500'}`}
            autoFocus
          />
          <button
            onClick={onFilenameFocus}
            className={`px-3 rounded border font-bold ${virtualInputTarget === 'saveName' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
            title="הקלדה מהמקלדת הווירטואלית לשדה זה"
          >
            🎯
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            שמור {isClosingDoc ? 'וסגור' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
