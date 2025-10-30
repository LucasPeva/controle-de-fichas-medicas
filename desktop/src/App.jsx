/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import './index.css';
import LoginForm from './LoginForm';
import ProjectRoutes from './ProjectRoutes';
import {Clipboard, ClipboardPlus, Pen, Trash, Trash2} from "lucide-react"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated') === true;
    setIsAuthenticated(auth);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace={true} /> : <LoginForm />} 
        />
        <Route 
          path="/app" 
          element={isAuthenticated ? <ProjectRoutes /> : <Navigate to="/login" replace={true} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;