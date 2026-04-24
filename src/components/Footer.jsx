import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2>CENTRAL MUSEUM</h2>
          <p>Inspiring generations through art and history.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Visit</h4>
            <a href="#">Opening Hours</a>
            <a href="#">Getting Here</a>
            <a href="#">Accessibility</a>
          </div>
          <div className="link-group">
            <h4>Explore</h4>
            <a href="#">The Collection</a>
            <a href="#">Exhibitions</a>
            <a href="#">Virtual Tours</a>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <a href="#">Membership</a>
            <a href="#">Donate</a>
            <a href="#">Volunteer</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Central Museum. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
