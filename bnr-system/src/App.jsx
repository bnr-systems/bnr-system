import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header />
      <main className='flex-grow flex items-center justify-center bg-[#E5E5E5] p-4'>
        <Outlet />
      </main>
        <Footer />
    </div>
  );
}

export default App;
