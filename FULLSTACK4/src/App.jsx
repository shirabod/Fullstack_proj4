import React, { useState } from 'react';

// --- KEYBOARD LAYOUTS ---
// Added 'caps' placeholder directly into the English layout arrays
const LAYOUTS = {
  HEB: [
    ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
    ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ']
  ],
  ENG_LOWER: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  ENG_UPPER: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]
};

// Fixed side layout for Numbers and Punctuation
const SYMBOLS_LAYOUT = [
  '1', '2', '3', '+',
  '4', '5', '6', '-',
  '7', '8', '9', '*',
  '.', '0', ',', '/',
  '?', '!', "'", '"',
  '(', ')', '@', '&',
  ':', ';', '$', '='
];

// רשימת הצבעים המוגדרים מראש כפי שביקשת
const PRESET_COLORS = ['#000000', '#2563EB', '#16A34A', '#DC2626', '#EA580C', '#9333EA'];

export default function App() {
  // --- STATE ---
  const [textElements, setTextElements] = useState([]);
  
  const [currentStyle, setCurrentStyle] = useState({
    color: '#000000', // שינינו את ברירת המחדל לשחור כדי שיתאים לפלטה
    fontSize: 24,
    fontFamily: 'Arial, sans-serif'
  });
  
  const [currentLang, setCurrentLang] = useState('HEB'); // Only 'HEB' or 'ENG' now
  const [isCaps, setIsCaps] = useState(false);

  // --- HANDLERS ---
  const handleKeyPress = (char) => {
    setTextElements((prev) => [
      ...prev, 
      { id: Date.now() + Math.random(), char, ...currentStyle }
    ]);
  };

  const handleDelete = () => {
    setTextElements((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    handleKeyPress(" ");
  };

  const handleClear = () => {
    setTextElements([]);
  };

  const handleGlobeClick = () => {
    setCurrentLang((prev) => prev === 'HEB' ? 'ENG' : 'HEB');
    setIsCaps(false); // Reset caps when switching languages
  };

  let activeLayout = currentLang === 'HEB' ? LAYOUTS.HEB : (isCaps ? LAYOUTS.ENG_UPPER : LAYOUTS.ENG_LOWER);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* --- TOP: DISPLAY AREA --- */}
      <div className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-gray-700">Visual Text Editor</h1>
          <button 
            onClick={handleClear}
            className="px-4 py-1 bg-red-100 text-red-600 rounded-md font-bold hover:bg-red-200 transition shadow-sm"
          >
            Clear All
          </button>
        </div>
        
        {/* Document Box */}
        <div 
          className="flex-1 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm overflow-y-auto outline-none cursor-text leading-tight"
          dir="auto"
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          {textElements.map((el) => (
            <span 
              key={el.id}
              style={{ 
                color: el.color, 
                fontSize: `${el.fontSize}px`, 
                fontFamily: el.fontFamily
              }}
            >
              {el.char}
            </span>
          ))}
          {/* Blinking cursor */}
          <span className="animate-pulse border-r-2 border-black ml-[2px] inline-block h-[1em] align-middle"></span>
        </div>
      </div>

      {/* --- BOTTOM: TOOLS & KEYBOARDS --- */}
      <div className="bg-gray-200 p-2 sm:p-3 border-t border-gray-300 select-none flex flex-row gap-2 sm:gap-4 h-auto shadow-inner">
        
        {/* --- LEFT PANEL: TOOLS & GLOBE --- */}
        <div className="w-16 sm:w-24 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-300 shrink-0">
          
          <button 
            onClick={handleGlobeClick}
            className="w-full py-2 text-2xl sm:text-3xl bg-blue-50 hover:bg-blue-100 rounded flex justify-center items-center shadow-sm border border-blue-200 transition"
            title="Change Language"
          >
            🌐
          </button>

          <hr className="border-gray-200 w-full my-1" />

          {/* Color Picker - הוחלף לכפתורים צבעוניים */}
          <div className="flex flex-col items-center w-full">
            <label className="text-[10px] font-bold text-gray-500 mb-1">COLOR</label>
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentStyle({...currentStyle, color})}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded cursor-pointer shadow-sm border-2 transition-all hover:scale-110 ${
                    currentStyle.color === color ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Input */}
          <div className="flex flex-col items-center w-full">
            <label className="text-[10px] font-bold text-gray-500 mb-1">SIZE</label>
            <input 
              type="number" 
              min="10" 
              max="100"
              value={currentStyle.fontSize} 
              onChange={(e) => setCurrentStyle({...currentStyle, fontSize: Number(e.target.value)})}
              className="w-full p-1 border rounded text-center text-xs sm:text-sm bg-gray-50"
            />
          </div>

          {/* Font Select */}
          <div className="flex flex-col items-center w-full">
            <label className="text-[10px] font-bold text-gray-500 mb-1">FONT</label>
            <select 
              value={currentStyle.fontFamily}
              onChange={(e) => setCurrentStyle({...currentStyle, fontFamily: e.target.value})}
              className="w-full p-1 border rounded bg-gray-50 text-[10px] sm:text-xs truncate cursor-pointer"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times</option>
              <option value="'Courier New', monospace">Courier</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="'Comic Sans MS', cursive">Comic</option>
            </select>
          </div>
        </div>

        {/* --- MIDDLE PANEL: MAIN KEYBOARD (LETTERS ONLY) --- */}
        <div className="flex-1 flex flex-col justify-end gap-1 sm:gap-2 pb-1 items-center">
          {activeLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 w-full">
              {row.map((char) => {
                // Render Caps Lock button explicitly if the char is 'caps'
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

                // Render normal letter buttons
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

          {/* Space & Delete under letters */}
          <div className="flex justify-center gap-1 sm:gap-2 mt-1 w-full max-w-2xl">
            <button
              onClick={handleSpace}
              className="flex-[3] h-10 sm:h-12 bg-white rounded shadow-sm flex items-center justify-center text-sm sm:text-lg font-bold text-gray-700 hover:bg-blue-50 active:bg-blue-200 transition-colors"
            >
              Space
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 h-10 sm:h-12 bg-gray-300 rounded shadow-sm flex items-center justify-center text-sm sm:text-lg font-bold text-gray-800 hover:bg-gray-400 active:bg-gray-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* --- RIGHT PANEL: NUMBERS & SYMBOLS --- */}
        <div className="w-28 sm:w-44 bg-white p-1 sm:p-2 rounded-lg shadow-sm border border-gray-300 shrink-0">
          <div className="grid grid-cols-4 gap-1 h-full content-start">
            {SYMBOLS_LAYOUT.map((symbol, idx) => (
              <button
                key={idx}
                onClick={() => handleKeyPress(symbol)}
                className="h-8 sm:h-10 bg-gray-100 rounded hover:bg-blue-100 active:bg-blue-300 flex items-center justify-center text-sm sm:text-base font-semibold text-gray-700 transition"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}