import React from 'react';

export default function LoadModal({ isOpen, currentUser, savedFilesList, onLoadFile, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 bottom-[14.5rem] sm:bottom-[16.5rem] bg-transparent flex items-start justify-center z-30 p-4 pointer-events-none" dir="rtl">
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
          <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">סגור</button>
        </div>
      </div>
    </div>
  );
}
