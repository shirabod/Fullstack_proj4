import React from 'react';

export default function TopToolbar({
  message,
  currentUser,
  onLogout,
  onNewDoc,
  onSave,
  onSaveAs,
  onLoad
}) {
  return (
    <div className="p-3 md:p-4 pb-2 flex flex-col gap-2 shadow-sm z-10 bg-white">
      <div className="flex justify-between items-center" dir="rtl">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">עורך טקסט מרובה-מסמכים</h1>
          {message && (
            <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full shadow-sm transition-opacity">
              {message}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 hidden md:block">
            מחובר/ת כ: <span className="font-bold text-gray-800">{currentUser}</span>
          </div>
          <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">התנתק</button>

          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          <button
            onClick={onNewDoc}
            className="px-3 md:px-4 py-1.5 bg-gray-100 text-gray-800 border border-gray-300 rounded-md font-bold hover:bg-gray-200 transition shadow-sm text-sm"
          >
            ➕ פתח אזור חדש
          </button>
          <button
            onClick={onSave}
            className="px-3 md:px-4 py-1.5 bg-blue-100 text-blue-700 rounded-md font-bold hover:bg-blue-200 transition shadow-sm text-sm"
          >
            💾 שמור מסמך
          </button>
          <button
            onClick={onSaveAs}
            className="px-3 md:px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-md font-bold hover:bg-indigo-200 transition shadow-sm text-sm hidden sm:block"
          >
            שמור בשם...
          </button>
          <button
            onClick={onLoad}
            className="px-3 md:px-4 py-1.5 bg-green-100 text-green-700 rounded-md font-bold hover:bg-green-200 transition shadow-sm text-sm"
          >
            📂 טען מסמך קיים
          </button>
        </div>
      </div>
    </div>
  );
}
