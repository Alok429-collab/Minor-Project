import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <a href="/">CENTRAL MUSEUM</a>
        </div>
        <nav className="nav-links">
          <a href="#visit">Visit</a>
          <a href="#collections">Explore</a>
          <a href="#exhibitions">Exhibitions</a>
        </nav>
        <div className="nav-actions">
          <a href="#tickets" className="btn btn-accent tickets-btn">Tickets</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
