import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cuisine/:cuisine" element={<SearchResults />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/search/:query" element={<SearchPage />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App; 