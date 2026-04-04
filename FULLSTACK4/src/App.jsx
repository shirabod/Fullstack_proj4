import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import EditorPage from './editor/EditorPage';

// Main App component that toggles between Login and Editor
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('visual_editor_current_user') || null;
  });

  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('visual_editor_current_user', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('visual_editor_current_user');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <EditorPage key={currentUser} currentUser={currentUser} onLogout={handleLogout} />;
}