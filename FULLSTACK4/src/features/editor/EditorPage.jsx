import React, { useState } from 'react';
import { SaveModal, LoadModal, SearchReplaceModal } from './components/Modals';
import storageService from './storage';
import { LAYOUTS, SYMBOLS_LAYOUT, EMOJI_LAYOUT, PRESET_COLORS } from './constants';
import TopToolbar from './components/TopToolbar';
import DocumentPanels from './components/DocumentPanels';
import KeyboardSection from './components/KeyboardSection';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function EditorPage({ currentUser, onLogout }) {
  const WORKSPACE_KEY = `visual_editor_workspace_${currentUser}`;
  const FILES_MAP_KEY = `visual_editor_files_${currentUser}`;

  // Legacy (pre-map) storage keys (kept for migration/backward compatibility)
  const LEGACY_INDEX_KEY = `visual_editor_file_index_${currentUser}`;
  const legacyGetFileKey = (name) => `visual_editor_file_${currentUser}_${name}`;

  const [openDocs, setOpenDocs] = useState(() => {
    const workspace = storageService.loadData(WORKSPACE_KEY);
    if (workspace && workspace.docs && workspace.docs.length > 0) {
      return workspace.docs;
    }
    return [{ id: generateId(), name: 'מסמך חדש 1', content: [], history: [[]], historyIndex: 0, isDraft: true, isDirty: false }];
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    const workspace = storageService.loadData(WORKSPACE_KEY);
    if (workspace && workspace.activeId) {
      return workspace.activeId;
    }
    return openDocs[0]?.id || '';
  });

  const [currentStyle, setCurrentStyle] = useState({ color: '#000000', fontSize: 24, fontFamily: 'Arial, sans-serif' });
  const [currentLang, setCurrentLang] = useState('HEB');
  const [isCaps, setIsCaps] = useState(false);
  const [message, setMessage] = useState('');

  const [searchTarget, setSearchTarget] = useState('');
  const [replaceWith, setReplaceWith] = useState('');
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [applyStyleToAll, setApplyStyleToAll] = useState(false);
  const [virtualInputTarget, setVirtualInputTarget] = useState('editor');
  const [caretIndex, setCaretIndex] = useState(0);
  const [searchHighlight, setSearchHighlight] = useState(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [filenameInput, setFilenameInput] = useState('');
  const [savedFilesList, setSavedFilesList] = useState([]);
  const [docToSaveId, setDocToSaveId] = useState(null);
  const [isClosingDoc, setIsClosingDoc] = useState(false);

  const activeDoc = openDocs.find((doc) => doc.id === activeDocId);
  const safeCaretIndex = activeDoc ? Math.min(caretIndex, activeDoc.content.length) : 0;

  const loadFilesMap = () => {
    const existingMap = storageService.loadData(FILES_MAP_KEY);
    if (existingMap && typeof existingMap === 'object') return existingMap;

    // Migrate from legacy index + per-file keys
    const legacyIndex = storageService.loadData(LEGACY_INDEX_KEY) || [];
    if (!Array.isArray(legacyIndex) || legacyIndex.length === 0) return {};

    const migrated = {};
    for (const name of legacyIndex) {
      const content = storageService.loadData(legacyGetFileKey(name));
      if (content) migrated[name] = content;
    }
    storageService.saveData(FILES_MAP_KEY, migrated);
    return migrated;
  };

  const saveFilesMap = (nextMap) => {
    storageService.saveData(FILES_MAP_KEY, nextMap);
  };

  const getFileIndex = () => Object.keys(loadFilesMap());

  const persistWorkspace = (docs, activeId = activeDocId) => {
    storageService.saveData(WORKSPACE_KEY, { docs, activeId });
  };

  const updateDocs = (updater, nextActiveId = activeDocId) => {
    setOpenDocs((prev) => {
      const nextDocs = updater(prev);
      persistWorkspace(nextDocs, nextActiveId);
      return nextDocs;
    });
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateActiveDocWithCaret = (updateFn) => {
    let nextCaret = safeCaretIndex;
    updateDocs((prev) =>
      prev.map((doc) => {
        if (doc.id !== activeDocId) return doc;
        const result = updateFn(doc.content);
        const newContent = result.content;
        nextCaret = Math.max(0, Math.min(result.caret, newContent.length));

        const newHistory = doc.history.slice(0, doc.historyIndex + 1);
        newHistory.push(newContent);
        if (newHistory.length > 50) newHistory.shift();

        return {
          ...doc,
          content: newContent,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true
        };
      })
    );
    setCaretIndex(nextCaret);
    setSearchHighlight(null);
  };

  const updateVirtualTargetValue = (transform) => {
    if (virtualInputTarget === 'saveName') {
      setFilenameInput((prev) => transform(prev));
      return;
    }
    if (virtualInputTarget === 'search') {
      setSearchTarget((prev) => transform(prev));
      return;
    }
    if (virtualInputTarget === 'replace') {
      setReplaceWith((prev) => transform(prev));
      return;
    }
    if (virtualInputTarget === 'fontSize') {
      const nextValue = transform(String(currentStyle.fontSize));
      const parsed = Number(nextValue);
      if (!Number.isNaN(parsed)) {
        setCurrentStyle((prev) => ({ ...prev, fontSize: Math.max(10, Math.min(100, parsed)) }));
      }
    }
  };

  const handleNewDoc = () => {
    const newId = generateId();
    const newCount = openDocs.length + 1;
    updateDocs(
      (prev) => [...prev, { id: newId, name: `מסמך חדש ${newCount}`, content: [], history: [[]], historyIndex: 0, isDraft: true, isDirty: false }],
      newId
    );
    setActiveDocId(newId);
  };

  const executeCloseDoc = (idToClose) => {
    const newDocs = openDocs.filter((doc) => doc.id !== idToClose);
    if (newDocs.length === 0) {
      const newId = generateId();
      updateDocs(
        () => [{ id: newId, name: 'מסמך חדש 1', content: [], history: [[]], historyIndex: 0, isDraft: true, isDirty: false }],
        newId
      );
      setActiveDocId(newId);
    } else {
      updateDocs(() => newDocs, activeDocId === idToClose ? newDocs[newDocs.length - 1].id : activeDocId);
      if (activeDocId === idToClose) {
        setActiveDocId(newDocs[newDocs.length - 1].id);
      }
    }
  };

  const saveSpecificDoc = (id) => {
    const doc = openDocs.find((d) => d.id === id);
    if (doc && !doc.isDraft) {
      const filesMap = loadFilesMap();
      filesMap[doc.name] = doc.content;
      saveFilesMap(filesMap);
      updateDocs((prev) => prev.map((d) => (d.id === id ? { ...d, isDirty: false } : d)));
      showMessage(`"${doc.name}" נשמר בהצלחה!`);
    }
  };

  const handleCloseDoc = (e, idToClose) => {
    e.stopPropagation();
    const docToClose = openDocs.find((d) => d.id === idToClose);

    if ((docToClose.isDraft && docToClose.content.length > 0) || (!docToClose.isDraft && docToClose.isDirty)) {
      const userWantsToSave = window.confirm(`האם תרצה לשמור את השינויים ב-"${docToClose.name}" לפני הסגירה?`);
      if (userWantsToSave) {
        if (docToClose.isDraft) {
          setDocToSaveId(idToClose);
          setIsClosingDoc(true);
          setFilenameInput('');
          setShowSaveModal(true);
        } else {
          saveSpecificDoc(idToClose);
          executeCloseDoc(idToClose);
        }
        return;
      }
    }
    executeCloseDoc(idToClose);
  };

  const handleSaveClick = (id = activeDocId) => {
    const doc = openDocs.find((d) => d.id === id);
    if (!doc) return;
    if (doc.isDraft) {
      setDocToSaveId(id);
      setIsClosingDoc(false);
      setFilenameInput('');
      setShowSaveModal(true);
    } else {
      saveSpecificDoc(id);
    }
  };

  const handleSaveAsClick = (id = activeDocId) => {
    const doc = openDocs.find((d) => d.id === id);
    if (!doc) return;
    setDocToSaveId(id);
    setIsClosingDoc(false);
    setFilenameInput(doc.isDraft ? '' : doc.name);
    setShowSaveModal(true);
  };

  const confirmSaveAs = () => {
    const name = filenameInput.trim();
    if (!name) return;

    const idToUpdate = docToSaveId || activeDocId;
    const docToUpdate = openDocs.find((d) => d.id === idToUpdate);
    if (!docToUpdate) return;

    const filesMap = loadFilesMap();
    filesMap[name] = docToUpdate.content;
    saveFilesMap(filesMap);

    updateDocs((prev) => prev.map((doc) => (doc.id === idToUpdate ? { ...doc, name, isDraft: false, isDirty: false } : doc)));
    setShowSaveModal(false);
    setVirtualInputTarget('editor');
    showMessage(`נשמר בשם: ${name}`);

    if (isClosingDoc) {
      executeCloseDoc(idToUpdate);
      setIsClosingDoc(false);
    }
    setDocToSaveId(null);
  };

  const handleLoadClick = () => {
    setSavedFilesList(getFileIndex());
    setShowLoadModal(true);
  };

  const loadFile = (name) => {
    const alreadyOpen = openDocs.find((d) => !d.isDraft && d.name === name);
    if (alreadyOpen) {
      setActiveDocId(alreadyOpen.id);
      persistWorkspace(openDocs, alreadyOpen.id);
      setShowLoadModal(false);
      showMessage('הקובץ כבר פתוח ופעיל כעת');
      return;
    }

    const filesMap = loadFilesMap();
    let data = filesMap[name];

    // Backward-compatible fallback to legacy per-file key
    if (!data) {
      const legacyData = storageService.loadData(legacyGetFileKey(name));
      if (legacyData) {
        data = legacyData;
        filesMap[name] = legacyData;
        saveFilesMap(filesMap);
      }
    }
    if (data) {
      const newId = generateId();
      updateDocs(
        (prev) => [...prev, { id: newId, name, content: data, history: [data], historyIndex: 0, isDraft: false, isDirty: false }],
        newId
      );
      setActiveDocId(newId);
      setShowLoadModal(false);
      showMessage(`הקובץ "${name}" נטען!`);
    } else {
      showMessage('שגיאה בטעינת הקובץ');
    }
  };

  const handleKeyPress = (char) => {
    if (virtualInputTarget !== 'editor') {
      updateVirtualTargetValue((prev) => `${prev}${char}`);
      return;
    }

    updateActiveDocWithCaret((content) => {
      const newElement = { id: generateId(), char, ...currentStyle };
      return { content: [...content, newElement], caret: content.length + 1 };
    });
  };

  const handleDelete = () => {
    if (virtualInputTarget !== 'editor') {
      updateVirtualTargetValue((prev) => prev.slice(0, -1));
      return;
    }

    updateActiveDocWithCaret((content) => {
      if (content.length === 0) {
        return { content, caret: 0 };
      }
      return { content: content.slice(0, -1), caret: content.length - 1 };
    });
  };

  const handleSpace = () => handleKeyPress(' ');

  const handleEnter = () => {
    if (virtualInputTarget === 'saveName') {
      confirmSaveAs();
      return;
    }
    handleKeyPress('\n');
  };

  const handleDeleteWord = () => {
    if (virtualInputTarget !== 'editor') {
      updateVirtualTargetValue(() => '');
      return;
    }

    updateActiveDocWithCaret((content) => {
      if (content.length === 0) return { content, caret: 0 };
      let i = content.length - 1;
      // Skip trailing spaces, but stop at newline
      while (i >= 0 && content[i].char === ' ') i--;
      // If we hit a newline, don't delete across it
      if (i >= 0 && content[i].char === '\n') {
        return { content, caret: content.length };
      }
      // Delete the word (stop at space or newline)
      while (i >= 0 && content[i].char !== ' ' && content[i].char !== '\n') i--;
      const newCaret = Math.max(0, i + 1);
      return { content: content.slice(0, newCaret), caret: newCaret };
    });
  };

  const handleClear = () => updateActiveDocWithCaret(() => ({ content: [], caret: 0 }));

  const handleUndo = () => {
    updateDocs((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId && doc.historyIndex > 0) {
          const newIndex = doc.historyIndex - 1;
          const newContent = doc.history[newIndex];
          setCaretIndex(newContent.length);
          return { ...doc, content: newContent, historyIndex: newIndex, isDirty: true };
        }
        return doc;
      })
    );
  };

  const handleRedo = () => {
    updateDocs((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId && doc.historyIndex < doc.history.length - 1) {
          const newIndex = doc.historyIndex + 1;
          const newContent = doc.history[newIndex];
          setCaretIndex(newContent.length);
          return { ...doc, content: newContent, historyIndex: newIndex, isDirty: true };
        }
        return doc;
      })
    );
  };

  const handleSearchOnly = () => {
    if (!searchTarget || !activeDoc) return;
    const docString = activeDoc.content.map((el) => el.char).join('');
    const fromIndex = safeCaretIndex;

    let index = docString.indexOf(searchTarget, fromIndex);
    if (index === -1 && fromIndex > 0) index = docString.indexOf(searchTarget, 0);

    if (index === -1) {
      showMessage('לא נמצאו תוצאות לחיפוש');
      setSearchHighlight(null);
      return;
    }

    setCaretIndex(index + searchTarget.length);
    setActiveDocId(activeDoc.id);
    setSearchHighlight({ docId: activeDoc.id, start: index, end: index + searchTarget.length });
    showMessage(`נמצאה תוצאה במיקום ${index + 1}`);
  };

  const handleSearchReplace = () => {
    if (!searchTarget) return;

    setSearchHighlight(null);

    updateActiveDocWithCaret((content) => {
      let newContent = [...content];
      let searchString = newContent.map((el) => el.char).join('');
      let index = searchString.indexOf(searchTarget);

      while (index !== -1) {
        const styleToUse = newContent[index];
        const replacementElements = replaceWith.split('').map((char) => ({
          id: generateId(),
          char,
          color: styleToUse.color,
          fontSize: styleToUse.fontSize,
          fontFamily: styleToUse.fontFamily
        }));

        newContent.splice(index, searchTarget.length, ...replacementElements);
        searchString = newContent.map((el) => el.char).join('');
        index = searchString.indexOf(searchTarget, index + replaceWith.length);
      }
      return { content: newContent, caret: newContent.length };
    });

    showMessage('ההחלפה בוצעה');
  };

  const handleApplyStyleToAll = () => {
    updateActiveDocWithCaret((content) => ({ content: content.map((el) => ({ ...el, ...currentStyle })), caret: content.length }));
    showMessage('הסגנון הוחל על כל הטקסט');
  };

  const handleEditorClick = () => {
    if (!activeDoc) return;
    setVirtualInputTarget('editor');
    setCaretIndex(activeDoc.content.length);
    setSearchHighlight(null);
  };

  const handleGlobeClick = () => {
    setCurrentLang((prev) => (prev === 'HEB' ? 'ENG' : 'HEB'));
    setIsCaps(false);
  };

  const activeLayout = currentLang === 'HEB' ? LAYOUTS.HEB : isCaps ? LAYOUTS.ENG_UPPER : LAYOUTS.ENG_LOWER;

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans relative">
      <SaveModal
        isOpen={showSaveModal}
        filenameInput={filenameInput}
        onFilenameChange={setFilenameInput}
        onFilenameFocus={() => setVirtualInputTarget('saveName')}
        virtualInputTarget={virtualInputTarget}
        onCancel={() => {
          setShowSaveModal(false);
          setVirtualInputTarget('editor');
          setDocToSaveId(null);
          setIsClosingDoc(false);
        }}
        onConfirm={confirmSaveAs}
        isClosingDoc={isClosingDoc}
      />

      <LoadModal
        isOpen={showLoadModal}
        currentUser={currentUser}
        savedFilesList={savedFilesList}
        onLoadFile={loadFile}
        onClose={() => setShowLoadModal(false)}
      />

      <SearchReplaceModal
        isOpen={showAdvancedEdit}
        searchTarget={searchTarget}
        replaceWith={replaceWith}
        virtualInputTarget={virtualInputTarget}
        onSearchChange={(next) => {
          setSearchTarget(next);
          setSearchHighlight(null);
        }}
        onReplaceChange={(next) => {
          setReplaceWith(next);
          setSearchHighlight(null);
        }}
        onFocusSearch={() => setVirtualInputTarget('search')}
        onFocusReplace={() => setVirtualInputTarget('replace')}
        onClose={() => {
          setShowAdvancedEdit(false);
          setVirtualInputTarget('editor');
          setSearchHighlight(null);
        }}
        onSearchOnly={handleSearchOnly}
        onReplaceAll={() => {
          handleSearchReplace();
          setShowAdvancedEdit(false);
          setVirtualInputTarget('editor');
        }}
      />

      <TopToolbar
        message={message}
        currentUser={currentUser}
        onLogout={onLogout}
        onNewDoc={handleNewDoc}
        onSave={() => handleSaveClick(activeDocId)}
        onSaveAs={() => handleSaveAsClick(activeDocId)}
        onLoad={handleLoadClick}
      />

      <DocumentPanels
        openDocs={openDocs}
        activeDocId={activeDocId}
        setActiveDocId={setActiveDocId}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClear={handleClear}
        handleCloseDoc={handleCloseDoc}
        handleEditorClick={handleEditorClick}
        caretIndex={activeDoc ? activeDoc.content.length : 0}
        currentLang={currentLang}
        highlightRange={searchHighlight}
      />

      <KeyboardSection
        virtualInputTarget={virtualInputTarget}
        openDocs={openDocs}
        activeDocId={activeDocId}
        handleGlobeClick={handleGlobeClick}
        setShowAdvancedEdit={setShowAdvancedEdit}
        applyStyleToAll={applyStyleToAll}
        setApplyStyleToAll={setApplyStyleToAll}
        PRESET_COLORS={PRESET_COLORS}
        currentStyle={currentStyle}
        setCurrentStyle={setCurrentStyle}
        updateActiveDocWithCaret={updateActiveDocWithCaret}
        caretIndex={safeCaretIndex}
        setVirtualInputTarget={setVirtualInputTarget}
        handleApplyStyleToAll={handleApplyStyleToAll}
        activeLayout={activeLayout}
        isCaps={isCaps}
        setIsCaps={setIsCaps}
        handleKeyPress={handleKeyPress}
        handleSpace={handleSpace}
        handleEnter={handleEnter}
        handleDelete={handleDelete}
        handleDeleteWord={handleDeleteWord}
        SYMBOLS_LAYOUT={SYMBOLS_LAYOUT}
        EMOJI_LAYOUT={EMOJI_LAYOUT}
      />
    </div>
  );
}
