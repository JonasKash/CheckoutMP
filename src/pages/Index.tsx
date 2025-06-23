
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Checkout from './Checkout';
import Success from './Success';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Routes>
        <Route path="/" element={<Checkout theme={theme} setTheme={setTheme} />} />
        <Route path="/checkout" element={<Checkout theme={theme} setTheme={setTheme} />} />
        <Route path="/success" element={<Success theme={theme} setTheme={setTheme} />} />
      </Routes>
    </div>
  );
};

export default Index;
