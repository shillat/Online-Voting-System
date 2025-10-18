// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        <Footer /> {/* Footer always visible at bottom */}
      </div>
    </BrowserRouter>
  );
}

export default App;
