import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src="/hero.png" alt="Central Museum Exterior" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h4 className="hero-subtitle">Art & Antiquities</h4>
        <h1 className="hero-title">Welcome to<br/>Central Museum</h1>
        <p className="hero-description">
          Experience the pinnacle of human creativity across centuries. Plan your visit, explore our collections, or ask our intelligent assistant for ticketing.
        </p>
        <div className="hero-buttons">
          <a href="#visit" className="btn btn-primary">Plan Your Visit</a>
          <a href="#collections" className="btn">Explore Collections</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
