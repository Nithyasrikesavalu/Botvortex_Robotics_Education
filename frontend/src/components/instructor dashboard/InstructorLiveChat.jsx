import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, MoreVertical, Search, Phone, Video, Smile, Check, CheckCheck, MessageCircle } from 'lucide-react';
import { API_URL } from '../../config/api';

const InstructorLiveChat = () => {
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [contacts, setContacts] = useState([]);
  const [myId, setMyId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setMyId(decoded.id);
      } catch (err) {
        console.error("Error parsing token", err);
      }
    }
  }, []);

  const fetchContacts = async () => {
    const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/chat/contacts`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
        if (data.length > 0 && !activeContact) {
          setActiveContact(data[0]);
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    if (!activeContact) return;
    const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/chat/${activeContact.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeContact]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeContact) return;

    const text = inputValue;
    setInputValue(''); 
    
    const tempMsg = {
      _id: Date.now().toString(),
      senderId: myId,
      receiverId: activeContact.id,
      text: text,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    const token = localStorage.getItem('instructorToken') || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: activeContact.id, text })
      });
      if (res.ok) {
        fetchMessages();
        fetchContacts();
      }
    } catch (err) { console.error("Error sending message", err); }
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full bg-[#111b21] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl font-sans">
      
      {/* Sidebar (Left Pane) - WhatsApp Style */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-[#222d34] flex flex-col bg-[#111b21]">
        
        {/* Sidebar Header */}
        <div className="h-[60px] px-4 bg-[#202c33] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
              ME
            </div>
            <h3 className="text-[#e9edef] font-semibold">Chats</h3>
          </div>
          <div className="flex gap-4 text-[#aebac1]">
            <button className="hover:text-white transition-colors"><MessageCircle size={20} /></button>
            <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-[#222d34] bg-[#111b21]">
          <div className="relative flex items-center bg-[#202c33] rounded-lg px-3 py-1.5">
            <Search size={18} className="text-[#aebac1] mr-3" />
            <input 
              type="text" 
              placeholder="Search students or start new chat" 
              className="w-full bg-transparent text-sm text-[#d1d7db] placeholder-[#8696a0] focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#111b21]">
          {contacts.map((contact, i) => (
            <div 
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`flex items-center px-3 py-3 cursor-pointer transition-colors ${
                activeContact?.id === contact.id ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-slate-600 flex-shrink-0 mr-3">
                {contact.avatar}
              </div>
              
              <div className={`flex-1 min-w-0 flex flex-col justify-center h-full ${i !== contacts.length - 1 ? 'border-b border-[#222d34] pb-3 -mb-3' : ''}`}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[17px] text-[#e9edef] truncate">{contact.name}</h4>
                  <span className="text-[12px] text-[#8696a0]">
                    {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                {contact.lastMessage && (
                  <p className="text-[14px] text-[#8696a0] truncate">
                    {contact.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area (Right Pane) */}
      <div className="flex-1 flex flex-col bg-[#0b141a] relative">
        
        {/* WhatsApp Web Background Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ backgroundImage: `url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')`, backgroundRepeat: 'repeat' }}
        ></div>

        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-[60px] px-4 bg-[#202c33] flex items-center justify-between z-10 flex-shrink-0">
              <div className="flex items-center gap-4 cursor-pointer">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-slate-600">
                  {activeContact.avatar}
                </div>
                <div>
                  <h3 className="text-[16px] text-[#e9edef] font-medium leading-tight">{activeContact.name}</h3>
                  <p className="text-[13px] text-[#8696a0]">online</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[#aebac1]">
                <button className="hover:text-white transition-colors"><Video size={20} /></button>
                <button className="hover:text-white transition-colors"><Phone size={18} /></button>
                <button className="hover:text-white transition-colors"><Search size={20} /></button>
                <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Display */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar z-10 flex flex-col gap-1">
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === myId;
                  const showTail = index === 0 || messages[index - 1].senderId !== msg.senderId;

                  return (
                    <motion.div
                      key={msg._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2' : ''}`}
                    >
                      <div 
                        className={`relative max-w-[65%] px-2 py-1.5 shadow-sm flex flex-col ${
                          isMe 
                            ? 'bg-[#005c4b] text-[#e9edef]' 
                            : 'bg-[#202c33] text-[#e9edef]'
                        } ${
                          isMe 
                            ? (showTail ? 'rounded-l-lg rounded-br-lg rounded-tr-none' : 'rounded-lg')
                            : (showTail ? 'rounded-r-lg rounded-bl-lg rounded-tl-none' : 'rounded-lg')
                        }`}
                      >
                        <div className="flex flex-wrap items-end gap-2">
                          <span className="text-[14.2px] leading-[19px] break-words pb-1 pt-0.5 px-1">{msg.text}</span>
                          <div className="flex items-center gap-1 ml-auto mt-1 float-right">
                            <span className="text-[11px] text-[#8696a0]">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            {isMe && <CheckCheck size={14} className="text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 bg-[#202c33] flex items-end gap-3 z-10 flex-shrink-0">
              <button type="button" className="p-2 text-[#8696a0] hover:text-[#d1d7db] transition-colors mb-1">
                <Smile size={26} />
              </button>
              <button type="button" className="p-2 text-[#8696a0] hover:text-[#d1d7db] transition-colors mb-1">
                <Paperclip size={24} />
              </button>
              <form onSubmit={handleSendMessage} className="flex-1 bg-[#2a3942] rounded-lg flex items-center min-h-[42px] px-3">
                <input 
                  type="text" 
                  value={inputValue || ""}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message" 
                  className="w-full bg-transparent text-[#e9edef] text-[15px] py-2 focus:outline-none"
                />
              </form>
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-full mb-1 flex items-center justify-center transition-all ${
                  inputValue.trim() 
                    ? 'bg-[#00a884] text-white hover:bg-[#00c298]' 
                    : 'bg-transparent text-[#8696a0]'
                }`}
              >
                <Send size={20} className={inputValue.trim() ? "ml-1" : ""} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center z-10 bg-[#222e35] border-b-[6px] border-[#00a884]">
            <div className="w-[320px] h-[200px] bg-slate-800 rounded-full mb-8 opacity-20 blur-2xl absolute"></div>
            <h2 className="text-[#e9edef] text-3xl font-light mb-4 relative z-10">WhatsApp Web</h2>
            <p className="text-[#8696a0] text-[14px] max-w-[400px] text-center leading-relaxed relative z-10">
              Send and receive messages without keeping your phone online.<br/>
              Use BotVortex on up to 4 linked devices and 1 phone at the same time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorLiveChat;
