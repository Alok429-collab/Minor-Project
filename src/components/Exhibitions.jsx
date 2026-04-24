import React from 'react';
import './Exhibitions.css';

const Exhibitions = () => {
  const exhibitions = [
    {
      id: 1,
      title: "The Pharaoh's Secrets",
      subtitle: "Unveiling Ancient Egypt",
      date: "Oct 15 - Feb 28",
      image: "/egypt.png",
      description: "Journey back in time to explore the golden age of the Pharaohs. This exclusive exhibition features newly discovered sarcophagi, intricate jewelry, and monumental statues that have never before been seen outside of Cairo."
    },
    {
      id: 2,
      title: "Modern Horizons",
      subtitle: "Light & Space",
      date: "Nov 01 - Mar 15",
      image: "/modern.png",
      description: "Immerse yourself in a futuristic sensory experience. Modern Horizons showcases cutting-edge installations that play with light, abstract geometry, and space, challenging your perception of reality."
    }
  ];

  return (
    <section id="exhibitions" className="exhibitions-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Current Exhibitions</h2>
          <p className="section-subtitle">Limited-time showcases you won't want to miss</p>
        </div>

        <div className="exhibitions-list">
          {exhibitions.map((exhibition, index) => (
            <div className={`exhibition-item ${index % 2 !== 0 ? 'reverse' : ''}`} key={exhibition.id}>
              <div className="exhibition-image-wrapper">
                <img src={exhibition.image} alt={exhibition.title} className="exhibition-image" />
              </div>
              <div className="exhibition-details">
                <span className="exhibition-date">{exhibition.date}</span>
                <h3 className="exhibition-title">{exhibition.title}</h3>
                <h4 className="exhibition-subtitle">{exhibition.subtitle}</h4>
                <p className="exhibition-description">{exhibition.description}</p>
                <a href="#tickets" className="btn btn-accent">Book Tickets Now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;
