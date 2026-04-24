import React from 'react';
import './Collections.css';

const Collections = () => {
  const categories = [
    {
      title: "Antiquities",
      image: "/sculpture.png",
      description: "Explore artifacts from ancient civilizations."
    },
    {
      title: "Paintings",
      image: "/renaissance.png",
      description: "Masterpieces from the Renaissance to the 19th Century."
    }
  ];

  return (
    <section id="collections" className="collections container">
      <div className="section-header">
        <h2 className="section-title">The Collections</h2>
        <p className="section-subtitle">Discover thousands of works spanning millennia</p>
      </div>
      
      <div className="collections-grid">
        {categories.map((category, index) => (
          <div className="collection-card" key={index}>
            <div className="card-image">
              <img src={category.image} alt={category.title} />
            </div>
            <div className="card-content">
              <h3 className="card-title">{category.title}</h3>
              <p className="card-description">{category.description}</p>
              <a href="#" className="card-link">Explore &rarr;</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collections;
