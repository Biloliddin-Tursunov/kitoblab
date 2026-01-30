import { useState, useEffect, useMemo } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Info,
  Menu,
  X
} from 'lucide-react';
import './App.css';
import { MessageBubble } from './components/MessageBubble';
import db from './db/db.json';
import type { Message } from './types';

const { metadata, messages: messagesData } = db;

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Process messages: reverse them so the latest is at the top (as requested)
  // Note: Telegram exports are usually chronological. Reversing puts newest on top.
  const processedMessages = useMemo(() => {
    const messages = messagesData as Message[];
    return [...messages].reverse();
  }, []);

  return (
    <div className="app-container">
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="header-title">{metadata.siteName}</div>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} color='black' /> : <Sun size={20} color='white' />}
          </button>
        </header>

        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

        <div className="chat-container">
          {processedMessages.map((msg, index) => {
            const prevMsg = processedMessages[index - 1];
            const showAuthor = !prevMsg || prevMsg.author !== msg.author || prevMsg.type === 'service';

            return (
              <MessageBubble
                key={msg.id || index}
                message={msg}
                showAuthor={showAuthor}
              />
            );
          })}
        </div>
      </main>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-header">
          <div className="header-title">{metadata.siteName}</div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        <div className="sidebar-content">
          <img src="/profile_pic.jpg" alt="KitobLab" className="profile-pic" />

          <div className="about-section">
            <h1 className="about-header">{metadata.siteName}</h1>
            <p className="about-tagline">{metadata.tagline}</p>

            <div className="info-block">
              <Info size={16} className="info-icon" />
              <div className="info-text">
                <div className="info-label">Biz haqimizda</div>
                <div className="info-value">{metadata.bio}</div>
              </div>
            </div>

            <div className="info-block">
              <Globe size={16} className="info-icon" />
              <div className="info-text">
                <div className="info-label">Veb-sayt</div>
                <div className="info-value">
                  <a href={metadata.links.website} target="_blank" rel="noreferrer">
                    {metadata.links.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>

            <div className="social-grid">
              <a href={metadata.links.telegram} target="_blank" rel="noreferrer" className="social-link-btn" title="Telegram">
                <Send size={20} />
              </a>
              <a href={metadata.links.instagram} target="_blank" rel="noreferrer" className="social-link-btn" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href={metadata.links.youtube} target="_blank" rel="noreferrer" className="social-link-btn" title="YouTube">
                <Youtube size={20} />
              </a>
              <a href={metadata.links.linkedin} target="_blank" rel="noreferrer" className="social-link-btn" title="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <footer className="footer" style={{ marginTop: 'auto' }}>
          &copy; {new Date().getFullYear()} KitobLab Archive
        </footer>
      </aside>
    </div>
  );
}

export default App;
