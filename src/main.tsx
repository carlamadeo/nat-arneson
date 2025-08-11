import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Turnos from './pages/Turnos';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <header className="bg-white shadow p-4 flex gap-4">
        <Link to="/">Acerca de mí</Link>
        <Link to="/turnos">Turnos</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turnos" element={<Turnos />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);