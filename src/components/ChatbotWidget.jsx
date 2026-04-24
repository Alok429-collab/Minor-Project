import React, { useState, useEffect, useRef } from 'react';
import './ChatbotWidget.css';

const TICKET_PRICE = 15;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to Central Museum! I am your virtual assistant. Please select an option or type your request:\n1. Museum Timings & Info\n2. Book Tickets' }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState('INIT'); // INIT, ASK_NAME, ASK_DATE, ASK_COUNT, PAYMENT, DONE
  const [bookingData, setBookingData] = useState({ name: '', date: '', count: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Chatbot State Machine
    if (chatState === 'INIT') {
      if (userText.includes('1') || userText.toLowerCase().includes('time') || userText.toLowerCase().includes('info')) {
        addBotMessage('🏛️ We are open every day from 9 AM to 6 PM. Closed on Tuesdays.\nGeneral admission is $15.\nWould you like to book tickets? (Type "2" or "yes")');
      } else if (userText.includes('2') || userText.toLowerCase().includes('book') || userText.toLowerCase().includes('ticket') || userText.toLowerCase() === 'yes') {
        setChatState('ASK_NAME');
        addBotMessage('Great! Let\'s book your tickets. What is your full name?');
      } else {
        addBotMessage('I didn\'t quite catch that. Please type "1" for Timings or "2" to Book Tickets.');
      }
    } 
    else if (chatState === 'ASK_NAME') {
      setBookingData({ ...bookingData, name: userText });
      setChatState('ASK_DATE');
      addBotMessage(`Nice to meet you, ${userText}! What date would you like to visit? (e.g., Tomorrow, Oct 24)`);
    } 
    else if (chatState === 'ASK_DATE') {
      setBookingData({ ...bookingData, date: userText });
      setChatState('ASK_COUNT');
      addBotMessage(`Got it, ${userText}. How many tickets do you need?`);
    } 
    else if (chatState === 'ASK_COUNT') {
      const count = parseInt(userText);
      if (isNaN(count) || count <= 0) {
        addBotMessage('Please enter a valid number (e.g., 2).');
      } else {
        setBookingData({ ...bookingData, count });
        const total = count * TICKET_PRICE;
        setChatState('PAYMENT');
        addBotMessage(`That will be $${total} for ${count} tickets. Please type "PAY" to confirm and process your payment.`);
      }
    } 
    else if (chatState === 'PAYMENT') {
      if (userText.toLowerCase() === 'pay') {
        addBotMessage('Initializing secure payment gateway... 💳');
        
        try {
          const totalAmount = bookingData.count * TICKET_PRICE;
          const response = await fetch('http://localhost:3000/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
          });
          const order = await response.json();

          const loadScript = (src) => {
            return new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = src;
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
            });
          };

          const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
          if (!res) {
            addBotMessage("❌ Failed to load Razorpay SDK. Are you online?");
            setChatState('INIT');
            return;
          }

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "dummy", 
            amount: order.amount,
            currency: order.currency,
            name: "Central Museum",
            description: `${bookingData.count} Tickets for ${bookingData.date}`,
            order_id: order.id,
            handler: async function (response) {
              addBotMessage('Payment successful! Saving your tickets... ⏳');
              
              try {
                const dbRes = await fetch('http://localhost:3000/api/book-ticket', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: bookingData.name,
                    visitDate: bookingData.date,
                    ticketsCount: bookingData.count,
                    paymentId: response.razorpay_payment_id
                  })
                });
                const data = await dbRes.json();
                
                if (data.success) {
                  addBotMessage(`✅ Booking confirmed!\nPayment ID: ${response.razorpay_payment_id}\nVisitor ID: ${data.visitor._id}\nSee you soon!`);
                  setChatState('DONE');
                } else {
                  addBotMessage('❌ There was an error saving your ticket to the database. Please contact support.');
                  setChatState('INIT');
                }
              } catch (err) {
                console.error(err);
                addBotMessage('❌ Unable to connect to the server. Your payment went through, but saving failed.');
                setChatState('INIT');
              }
            },
            prefill: {
              name: bookingData.name,
            },
            theme: {
              color: "#c9a96e"
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
            addBotMessage('❌ Payment failed or was cancelled. Type "PAY" to try again.');
          });
          rzp.open();

        } catch (err) {
          console.error(err);
          addBotMessage('❌ Unable to create payment order. Is the backend server running?');
          setChatState('INIT');
        }
      } else {
        addBotMessage('Type "PAY" to process the payment or "CANCEL" to stop.');
      }
    } else if (chatState === 'DONE') {
      addBotMessage('Your booking is complete! If you need anything else, just refresh or type "restart".');
      if (userText.toLowerCase() === 'restart') {
        setChatState('INIT');
        setBookingData({ name: '', date: '', count: 0 });
        addBotMessage('Welcome back! 1. Info  2. Book Tickets');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="tickets" className="chatbot-section">
      <div className="chatbot-container container">
        <div className="chatbot-info">
          <h2>Get Your Tickets instantly</h2>
          <p>
            Skip the lines and book your visit through our new intelligent assistant. 
            Ask about opening hours, special exhibitions, and secure your tickets in seconds.
          </p>
          <button 
            className="btn btn-primary start-chat-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close Assistant' : 'Start Ticketing Assistant'}
          </button>
        </div>

        {isOpen && (
          <div className="chatbot-widget-area">
            <div className="chatbot-header">
              <h3>Central Museum Assistant</h3>
              <span className="status-dot"></span>
            </div>
            <div className="chatbot-body" ref={chatBodyRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}-message`}>
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="message bot-message typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </div>
            <div className="chatbot-input">
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button className="send-btn" onClick={handleSend} disabled={isTyping}>&rarr;</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatbotWidget;
