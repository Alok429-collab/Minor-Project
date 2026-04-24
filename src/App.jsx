import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatbotWidget from './components/ChatbotWidget';
import Collections from './components/Collections';
import Exhibitions from './components/Exhibitions';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ChatbotWidget />
        <Collections />
        <Exhibitions />
      </main>
      <Footer />
    </>
  );
}

export default App;
