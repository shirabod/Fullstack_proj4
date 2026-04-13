import React from 'react';

export default function KeyboardSection({
  virtualInputTarget,
  openDocs = [],
  activeDocId,
  handleGlobeClick,
  setShowAdvancedEdit,
  applyStyleToAll,
  setApplyStyleToAll,
  PRESET_COLORS = [],
  currentStyle,
  setCurrentStyle,
  updateActiveDocWithCaret,
  caretIndex,
  setVirtualInputTarget,
  activeLayout = [],
  isCaps,
  setIsCaps,
  handleKeyPress,
  handleSpace,
  handleEnter,
  handleDelete,
  handleDeleteWord,
  SYMBOLS_LAYOUT = [],
  EMOJI_LAYOUT = []
}) {
  // הגנה מפני שגיאת undefined בחיפוש שם המסמך
  const activeDoc = Array.isArray(openDocs) ? openDocs.find((d) => d?.id === activeDocId) : null;
  const activeDocName = activeDoc?.name || 'מסמך';

  // סגנון אחיד לכל האלמנטים במקלדת
  const uniformBaseStyle = "text-sm sm:text-base font-semibold";
  const keyHeight = "h-11 sm:h-12";
  const controlBtnStyle = "bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95";

  return (
    <div className="bg-slate-50 border-t border-slate-300 select-none flex flex-row h-64 sm:h-72 w-full relative z-20 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
      
      {/* אזור 1: סרגל כלי עיצוב ושפה (שמאל) - פרוס לגובה המקלדת */}
      <div className="w-28 sm:w-36 flex flex-col border-r border-slate-200 bg-white p-2 justify-between shrink-0">
        <div className="flex flex-col gap-2">
          {/* כפתורי שפה וחיפוש */}
          <div className="flex gap-1.5">
            <button
              onClick={handleGlobeClick}
              className={`flex-1 ${keyHeight} ${controlBtnStyle} flex items-center justify-center`}
              title="שנה שפה"
            >
              <span className="text-xl">🌐</span>
            </button>
            <button
              onClick={() => setShowAdvancedEdit(true)}
              className={`flex-1 ${keyHeight} ${controlBtnStyle} flex items-center justify-center`}
              title="חיפוש והחלפה"
            >
              <span className="text-xl">🔍</span>
            </button>
          </div>

          {/* בחירת צבעים - פרוסה רחב יותר */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setCurrentStyle((prev) => ({ ...prev, color }));
                  if (applyStyleToAll) {
                    updateActiveDocWithCaret((content) => ({
                      content: content.map((el) => ({ ...el, color })),
                      caret: caretIndex
                    }));
                  }
                }}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  currentStyle?.color === color ? 'border-slate-800 scale-110 shadow-md ring-2 ring-white' : 'border-white shadow-sm'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* פונטים וגודל - בתחתית האזור */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={applyStyleToAll}
              onChange={(e) => setApplyStyleToAll(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-[10px] font-bold text-slate-600 uppercase">להכל</span>
          </label>

          <input
            type="number"
            value={currentStyle?.fontSize || 16}
            onFocus={() => setVirtualInputTarget('fontSize')}
            onChange={(e) => {
              const size = Number(e.target.value);
              setCurrentStyle((prev) => ({ ...prev, fontSize: size }));
              if (applyStyleToAll) {
                updateActiveDocWithCaret((content) => ({
                  content: content.map((el) => ({ ...el, fontSize: size })),
                  caret: caretIndex
                }));
              }
            }}
            className={`w-full h-10 border rounded-xl text-center transition-all outline-none ${uniformBaseStyle} ${
              virtualInputTarget === 'fontSize' ? 'border-blue-500 bg-white ring-2 ring-blue-50' : 'border-slate-200 bg-slate-50'
            }`}
          />

          <select
            value={currentStyle?.fontFamily || 'Arial, sans-serif'}
            onChange={(e) => {
              const font = e.target.value;
              setCurrentStyle((prev) => ({ ...prev, fontFamily: font }));
              if (applyStyleToAll) {
                updateActiveDocWithCaret((content) => ({
                  content: content.map((el) => ({ ...el, fontFamily: font })),
                  caret: caretIndex
                }));
              }
            }}
            className="w-full h-10 border border-slate-200 rounded-xl bg-slate-50 px-1 outline-none cursor-pointer hover:bg-white transition-all text-[10px] font-bold"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times</option>
            <option value="'Courier New', monospace">Courier</option>
          </select>
        </div>
      </div>

      {/* אזור 2: מקלדת מרכזית (אותיות) - הגובה שאליו כולם שואפים */}
      <div className="flex-1 flex flex-col p-3 gap-2 justify-center items-stretch bg-slate-50/50">
        {Array.isArray(activeLayout) && activeLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2 h-11 sm:h-12">
            {row.map((char) => (
              <button
                key={char === 'caps' ? 'caps' : char}
                onClick={() => (char === 'caps' ? setIsCaps(!isCaps) : handleKeyPress(char))}
                className={`flex-1 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center transition-all active:scale-95 active:shadow-inner ${
                  char === 'caps'
                    ? isCaps
                      ? 'bg-blue-600 text-white border-blue-700 text-xs'
                      : 'bg-slate-200 text-slate-700 text-xs'
                    : `bg-white text-slate-800 hover:border-blue-300 hover:text-blue-600 ${uniformBaseStyle}`
                }`}
              >
                {char === 'caps' ? (isCaps ? 'CAPS' : 'caps') : char}
              </button>
            ))}
          </div>
        ))}

        {/* שורת הפעולות התחתונה */}
        <div className="flex justify-center gap-2 h-11 sm:h-12 mt-1">
          <button
            onClick={handleSpace}
            className="flex-[4] bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            Space
          </button>
          <button
            onClick={handleEnter}
            className="flex-[1.5] bg-blue-600 text-white rounded-xl shadow-md font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            ↵ ENTER
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center text-xl hover:bg-rose-100 transition-all"
            title="מחק"
          >
            ⌫
          </button>
          <button
            onClick={handleDeleteWord}
            className="flex-1 bg-slate-800 text-white rounded-xl text-[8px] font-bold leading-none hover:bg-slate-900 transition-all"
          >
            DEL<br/>WORD
          </button>
        </div>

        <div className="text-center mt-1">
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            קלט עבור: {virtualInputTarget === 'editor' ? activeDocName : 'מערכת'}
          </span>
        </div>
      </div>

      {/* אזור 3: סימנים ואימוג'ים (ימין) - פריסה רחבה המיישרת גובה למרכז */}
      <div className="w-64 sm:w-80 lg:w-96 flex flex-col border-l border-slate-200 bg-white">
        <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">
          {/* פאנל סימנים ומספרים - פריסה ל-8 עמודות כדי לחסוך גובה */}
          <div className="flex-1 grid grid-cols-8 gap-1 p-1.5 bg-slate-50 rounded-xl border border-slate-100 content-start overflow-y-auto custom-scrollbar">
            {Array.isArray(SYMBOLS_LAYOUT) && SYMBOLS_LAYOUT.map((symbol, idx) => (
              <button
                key={idx}
                onClick={() => handleKeyPress(symbol)}
                className={`h-10 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center shadow-sm active:scale-90 ${uniformBaseStyle}`}
              >
                {symbol}
              </button>
            ))}
          </div>

          {/* פאנל אימוג'ים - פריסה ל-8 עמודות */}
          <div className="h-28 sm:h-32 grid grid-cols-8 gap-1 p-1.5 bg-orange-50/30 rounded-xl border border-orange-100 content-start overflow-y-auto custom-scrollbar">
            {Array.isArray(EMOJI_LAYOUT) && EMOJI_LAYOUT.slice(0, 32).map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleKeyPress(emoji)}
                className={`bg-white/80 rounded-lg hover:scale-110 transition-transform flex items-center justify-center shadow-sm h-9 ${uniformBaseStyle}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
