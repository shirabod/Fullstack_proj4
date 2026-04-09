import React from 'react';

export default function KeyboardSection({
  virtualInputTarget,
  openDocs,
  activeDocId,
  handleGlobeClick,
  setShowAdvancedEdit,
  applyStyleToAll,
  setApplyStyleToAll,
  PRESET_COLORS,
  currentStyle,
  setCurrentStyle,
  updateActiveDocWithCaret,
  caretIndex,
  setVirtualInputTarget,
  handleApplyStyleToAll,
  activeLayout,
  isCaps,
  setIsCaps,
  handleKeyPress,
  handleSpace,
  handleEnter,
  handleDelete,
  handleDeleteWord,
  SYMBOLS_LAYOUT,
  EMOJI_LAYOUT
}) {
  return (
    <div className="bg-gray-200 p-2 sm:p-3 border-t border-gray-300 select-none flex flex-row gap-2 sm:gap-4 h-auto shadow-inner relative z-20">
      <div className="absolute -top-8 left-0 right-0 text-center pointer-events-none">
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-t-md shadow-sm">
          {virtualInputTarget === 'editor'
            ? `המקלדת מקלידה אל: ${openDocs.find((d) => d.id === activeDocId)?.name || ''}`
            : `המקלדת מקלידה לשדה: ${
                virtualInputTarget === 'saveName'
                  ? 'שם קובץ'
                  : virtualInputTarget === 'search'
                  ? 'חיפוש'
                  : virtualInputTarget === 'replace'
                  ? 'החלפה'
                  : 'גודל גופן'
              }`}
        </span>
      </div>

      <div className="w-16 sm:w-28 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-300 shrink-0">
        <div className="flex gap-1">
          <button
            onClick={handleGlobeClick}
            className="flex-1 py-1 text-xl bg-blue-50 hover:bg-blue-100 rounded flex justify-center items-center shadow-sm border border-blue-200 transition"
            title="שנה שפה"
          >
            🌐
          </button>
          <button
            onClick={() => setShowAdvancedEdit(true)}
            className="flex-1 py-1 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 rounded flex justify-center items-center shadow-sm border border-purple-200 transition font-bold"
            title="חיפוש והחלפה"
          >
            🔍
          </button>
        </div>

        <hr className="border-gray-200 w-full my-1" />

        <div className="flex justify-between items-center w-full px-1">
          <label className="text-[10px] font-bold text-gray-500">עיצוב</label>
          <label className="text-[9px] flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-800" title="החל עיצוב על כל הטקסט הקיים או רק מכאן והלאה">
            <input type="checkbox" checked={applyStyleToAll} onChange={(e) => setApplyStyleToAll(e.target.checked)} className="cursor-pointer" />
            הכל
          </label>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-3 gap-1 w-full">
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
                className={`w-full aspect-square rounded cursor-pointer shadow-sm border transition-all hover:scale-110 ${
                  currentStyle.color === color ? 'border-gray-800 scale-110 ring-1 ring-gray-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <input
            type="number"
            min="10"
            max="100"
            value={currentStyle.fontSize}
            onFocus={() => setVirtualInputTarget('fontSize')}
            onChange={(e) => {
              const size = Number(e.target.value);
              if (Number.isNaN(size)) return;
              setCurrentStyle((prev) => ({ ...prev, fontSize: size }));
              if (applyStyleToAll) {
                updateActiveDocWithCaret((content) => ({
                  content: content.map((el) => ({ ...el, fontSize: size })),
                  caret: caretIndex
                }));
              }
            }}
            className={`w-full p-1 border rounded text-center text-xs sm:text-sm bg-gray-50 mt-1 ${virtualInputTarget === 'fontSize' ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
            title="גודל גופן"
          />
        </div>

        <div className="flex flex-col items-center w-full">
          <select
            value={currentStyle.fontFamily}
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
            className="w-full p-1 border rounded bg-gray-50 text-[10px] sm:text-xs truncate cursor-pointer mt-1"
            title="סוג גופן"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times</option>
            <option value="'Courier New', monospace">Courier</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
            <option value="'Comic Sans MS', cursive">Comic</option>
          </select>
        </div>

        <button onClick={handleApplyStyleToAll} className="w-full mt-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold p-1 rounded border border-gray-300 text-gray-700" title="החל עיצוב נוכחי על כל הטקסט">
          החל עיצוב על הכל
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-1 sm:gap-2 pb-1 items-center">
        {activeLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 w-full">
            {row.map((char) => {
              if (char === 'caps') {
                return (
                  <button
                    key="caps"
                    onClick={() => setIsCaps(!isCaps)}
                    className={`px-2 sm:px-4 h-10 sm:h-12 rounded shadow-sm flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${isCaps ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                  >
                    ⇪ CAPS
                  </button>
                );
              }

              return (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className="flex-1 min-w-[1.8rem] max-w-[3rem] sm:max-w-[4rem] h-10 sm:h-12 bg-white rounded shadow-sm flex items-center justify-center text-lg sm:text-xl font-medium text-gray-800 hover:bg-blue-50 active:bg-blue-200 transition-colors"
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}

        <div className="flex justify-center gap-1 sm:gap-2 mt-1 w-full max-w-2xl">
          <button
            onClick={handleSpace}
            className="flex-[4] h-10 sm:h-12 bg-white rounded shadow-sm flex items-center justify-center text-sm sm:text-lg font-bold text-gray-700 hover:bg-blue-50 active:bg-blue-200 transition-colors"
          >
            רווח
          </button>
          <button
            onClick={handleEnter}
            className="flex-[2] h-10 sm:h-12 bg-blue-100 rounded shadow-sm flex items-center justify-center text-sm sm:text-lg font-bold text-blue-800 hover:bg-blue-200 active:bg-blue-300 transition-colors"
          >
            Enter ↵
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 min-w-[3rem] h-10 sm:h-12 bg-gray-300 rounded shadow-sm flex items-center justify-center text-sm font-bold text-gray-800 hover:bg-gray-400 active:bg-gray-500 transition-colors"
            title="מחק תו אחרון"
          >
            ⌫
          </button>
          <button
            onClick={handleDeleteWord}
            className="flex-1 min-w-[3rem] h-10 sm:h-12 bg-gray-400 rounded shadow-sm flex items-center justify-center text-xs font-bold text-white hover:bg-gray-500 active:bg-gray-600 transition-colors leading-tight"
            title="מחק מילה אחרונה"
          >
            מחק<br/>מילה
          </button>
        </div>
      </div>

      <div className="w-52 sm:w-72 lg:w-80 bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-300 shrink-0">
        <div className="grid grid-cols-2 gap-2 h-full">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-gray-500 font-bold mb-2 text-center">סימנים</div>
            <div className="grid grid-cols-4 gap-1 pr-1">
              {SYMBOLS_LAYOUT.map((symbol, idx) => (
                <button
                  key={idx}
                  onClick={() => handleKeyPress(symbol)}
                  className="h-8 sm:h-9 bg-gray-100 rounded hover:bg-blue-100 active:bg-blue-300 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-700 transition"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 border-r border-gray-200 pr-1">
            <div className="text-[10px] sm:text-xs text-gray-500 font-bold mb-2 text-center">אימוג'ים</div>
            <div className="grid grid-cols-4 gap-1 pr-1">
              {EMOJI_LAYOUT.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleKeyPress(emoji)}
                  className="h-8 sm:h-9 bg-orange-50 rounded hover:bg-orange-100 active:bg-orange-200 flex items-center justify-center text-base transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
