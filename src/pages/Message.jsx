import React, { useEffect, useRef, useState } from 'react';
import { ListFilter, Send, Phone, Paperclip, Mic, Square } from 'lucide-react';
import Sidebar from '../components/SideBar';
import Header from '../components/UI/Header';

export default function Message() {
  const [chats] = useState([
    {
      id: 'chat1',
      name: 'John Smith, CEO',
      email: 'john@nibble.com',
      avatar: './User.svg',
      lastSeen: 'online',
      tags: ['Promotion', 'Expires soon'],
      themeMsg: 'Special Offer Just for You!',
      lastOn: '2 hours ago',
      lastMsg: 'Hi, we are running a new promotion in your area. If you want to get a free delivery, then use code ’FREE’ at the checkout. '
    },
    {
      id: 'chat2',
      name: 'Anna, Support',
      email: 'anna@nibble.com',
      avatar: './User.svg',
      lastSeen: 'online',
      themeMsg: 'RE: Late Delivery Refund Request',
      lastOn: 'Yesterday',
      lastMsg: 'Hi, I can confirm that the delivery was late and you are entitled for a refund of $3.99. Thank you.'
    },
    {
      id: 'chat3',
      name: 'Anna, Support',
      email: 'anna@nibble.com',
      avatar: './User.svg',
      lastSeen: 'online',
      themeMsg: 'RE: Late Delivery Refund Request',
      lastOn: 'Yesterday',
      lastMsg: 'Hi, I can confirm that the delivery was late and you are entitled for a refund of $3.99. Thank you.'
    },
    {
      id: 'chat4',
      name: 'Anna, Support',
      email: 'anna@nibble.com',
      avatar: './User.svg',
      lastSeen: 'online',
      themeMsg: 'RE: Late Delivery Refund Request',
      lastOn: 'Yesterday',
      lastMsg: 'Hi, I can confirm that the delivery was late and you are entitled for a refund of $3.99. Thank you.'
    },
    {
      id: 'chat5',
      name: 'Anna, Support',
      email: 'anna@nibble.com',
      avatar: './User.svg',
      lastSeen: 'online',
      themeMsg: 'RE: Late Delivery Refund Request',
      lastOn: 'Yesterday',
      lastMsg: 'Hi, I can confirm that the delivery was late and you are entitled for a refund of $3.99. Thank you.'
    }
  ]);

  const [currentChatId, setCurrentChatId] = useState('chat1');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [quickReplies] = useState(["I didn't get my order.", "I have received a wrong order"]);

  const ws = useRef(null);
  const identity = useRef(null);
  const audioRef = useRef(null);
  const sendAudioRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioStreamRef = useRef(null); 
  const voiceAudioRef = useRef(null);

  const [playingVoiceIdx, setPlayingVoiceIdx] = useState(null);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(0);

  const getStoredMessages = (userId) => {
    try {
      const data = localStorage.getItem(`messagesByChat_${userId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveMessages = (userId, messages) => {
    localStorage.setItem(`messagesByChat_${userId}`, JSON.stringify(messages));
  };

  const [userId] = useState(() => {
    let id = localStorage.getItem('chatUserId');
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatUserId', id);
    }
    return id;
  });

  const [messagesByChat, setMessagesByChat] = useState(() =>
    getStoredMessages(localStorage.getItem('chatUserId') || userId)
  );

  useEffect(() => {
    saveMessages(userId, messagesByChat);
  }, [messagesByChat, userId]);

  const messages = messagesByChat[currentChatId] || [];
  const currentChat = chats.find(c => c.id === currentChatId);

  useEffect(() => {
    identity.current = userId; 
    ws.current = new WebSocket(`wss://s15001.blr1.piesocket.com/v3/1?api_key=60NNN6aakSYBKkiTRZqOg2rowmIzYegTmzpfvc6y&notify_self=1&user_id=${identity.current}`);
    console.log('WebSocket connected with user ID:', identity.current);

    ws.current.onmessage = async (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        data = { text: event.data, userId: null, chatId: currentChatId };
      }

      if (data.type === 'call') {
        const myUserId = getCurrentUserId();
        if (data.action === 'call' && data.to === myUserId) {
          setCallFrom(data.from);
          setCallState('ringing');
          if (ringtoneRef.current) {
            ringtoneRef.current.currentTime = 0;
            ringtoneRef.current.play();
          }
          callTimeoutRef.current = setTimeout(() => {
            setCallState('ended');
            setCallFrom(null);
            if (ringtoneRef.current) ringtoneRef.current.pause();
          }, 60000);
          return;
        }
        if (data.action === 'accept' && data.to === myUserId) {
          setCallState('in-call');
          if (outgoingRef.current) outgoingRef.current.pause();
          clearTimeout(callTimeoutRef.current);
          return;
        }
        if ((data.action === 'reject' || data.action === 'timeout' || data.action === 'end') && data.to === myUserId) {
          setCallState('ended');
          setCallFrom(null);
          if (ringtoneRef.current) ringtoneRef.current.pause();
          if (outgoingRef.current) outgoingRef.current.pause();
          clearTimeout(callTimeoutRef.current);
          return;
        }
      }

      if (data.type === 'voice' && data.audioBase64) {
        try {
          let audioUrl = data.audioUrl;
          if (!audioUrl) {
            const arr = data.audioBase64.split(',');
            if (arr.length === 2) {
              const mime = arr[0].match(/:(.*?);/)[1];
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) u8arr[n] = bstr.charCodeAt(n);
              const blob = new Blob([u8arr], { type: mime });
              audioUrl = URL.createObjectURL(blob);
              data.audioUrl = audioUrl;
            }
          }
        } catch (e) {
          console.error('Ошибка обработки голосового сообщения:', e);
        }
      }

      if (!data.text && !data.audioBase64 && !data.audioUrl && data.type !== 'call') {
        data.text = '[Пустое сообщение]';
      }

      const chatId = data.chatId || currentChatId;
      const myUserId = getCurrentUserId();
      const isOwnMessage = data.userId === myUserId;

      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { ...data }]
      }));

      if (!isOwnMessage && chatId === currentChatId) playNotification();
    };

    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onclose = () => console.log('WebSocket closed');
    ws.current.onerror = error => console.error('WebSocket error:', error);

    return () => {
      ws.current?.close();
      clearTimeout(callTimeoutRef.current);
    };
  }, [userId, currentChatId]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const playSendSound = () => {
    if (sendAudioRef.current) {
      sendAudioRef.current.currentTime = 0;
      sendAudioRef.current.play();
    }
  };

  const sendMessage = () => {
    if (ws.current && input.trim() !== '') {
      const msgObj = {
        text: input,
        userId,
        chatId: currentChatId,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      ws.current.send(JSON.stringify(msgObj));
      setInput('');
      playSendSound();
    }
  };

  const handleQuickReply = (text) => setInput(text);
  const handleChatChange = (id) => setCurrentChatId(id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    (chat.lastMsg && chat.lastMsg.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const msgObj = {
        text: `📎 ${file.name}`,
        userId,
        chatId: currentChatId,
        timestamp: new Date().toISOString(),
        type: 'file'
      };
      ws.current.send(JSON.stringify(msgObj));
    }
  };

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, msgIdx: null });
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleDeleteMessage = (idx) => {
    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId]: prev[currentChatId].filter((_, i) => i !== idx)
    }));
    setContextMenu({ visible: false, x: 0, y: 0, msgIdx: null });
  };

  const handleEditMessage = (idx) => {
    setEditIdx(idx);
    setEditValue(messages[idx].text);
    setContextMenu({ visible: false, x: 0, y: 0, msgIdx: null });
  };

  const handleSaveEdit = () => {
    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId]: prev[currentChatId].map((msg, i) =>
        i === editIdx ? { ...msg, text: editValue } : msg
      )
    }));
    setEditIdx(null);
    setEditValue('');
  };

  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, msgIdx: null });
    if (contextMenu.visible) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);

  const [callActive, setCallActive] = useState(false);
  const [callError, setCallError] = useState('');
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  const [callState, setCallState] = useState('idle'); 
  const [callFrom, setCallFrom] = useState(null); 
  const [callTimer, setCallTimer] = useState(0);
  const ringtoneRef = useRef(null);
  const outgoingRef = useRef(null);
  const callTimeoutRef = useRef(null);

  const startCall = async () => {
    setCallError('');
    setCallState('calling');
    setCallFrom(null);
    const peerId = currentChat?.id || '';
    ws.current.send(JSON.stringify({ type: 'call', action: 'call', from: userId, to: peerId }));
    if (outgoingRef.current) {
      outgoingRef.current.currentTime = 0;
      outgoingRef.current.play();
    }
    callTimeoutRef.current = setTimeout(() => {
      setCallState('ended');
      ws.current.send(JSON.stringify({ type: 'call', action: 'timeout', from: userId, to: peerId }));
      if (outgoingRef.current) outgoingRef.current.pause();
    }, 60000);
  };

  const acceptCall = async () => {
    setCallState('in-call');
    clearTimeout(callTimeoutRef.current);
    if (ringtoneRef.current) ringtoneRef.current.pause();
    ws.current.send(JSON.stringify({ type: 'call', action: 'accept', from: userId, to: callFrom }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      setCallActive(true);
    } catch (err) {
      setCallError('Нет доступа к камере/микрофону');
      setCallActive(true);
    }
  };

  const rejectCall = () => {
    setCallState('ended');
    clearTimeout(callTimeoutRef.current);
    if (ringtoneRef.current) ringtoneRef.current.pause();
    ws.current.send(JSON.stringify({ type: 'call', action: 'reject', from: userId, to: callFrom }));
    setCallFrom(null);
  };

  const endCall = () => {
    setCallState('ended');
    if (callFrom) {
      ws.current.send(JSON.stringify({ type: 'call', action: 'end', from: userId, to: callFrom }));
    } else if (currentChat?.id) {
      ws.current.send(JSON.stringify({ type: 'call', action: 'end', from: userId, to: currentChat.id }));
    }
    setCallFrom(null);
    clearTimeout(callTimeoutRef.current);
    if (ringtoneRef.current) ringtoneRef.current.pause();
    if (outgoingRef.current) outgoingRef.current.pause();
  };

  const getCurrentUserId = () => localStorage.getItem('chatUserId');

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      recordedChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.onloadedmetadata = () => {
            const duration = audio.duration;
            const msgObj = {
              type: 'voice',
              audioBase64: base64,
              audioUrl, 
              duration,
              userId,
              chatId: currentChatId,
              timestamp: new Date().toISOString(),
            };
            ws.current.send(JSON.stringify(msgObj));
          };
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      setIsRecording(false);
      alert('Не удалось начать запись: ' + err.message);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
    }
  };

  const handlePlayVoice = (audioUrl, idx) => {
    if (voiceAudioRef.current) {
      let url = audioUrl;
      const msg = messages[idx];
      if (!url && msg.audioBase64) {
        const arr = msg.audioBase64.split(',');
        if (arr.length === 2) {
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          const blob = new Blob([u8arr], { type: mime });
          url = URL.createObjectURL(blob);
        }
      }
      if (url) {
        voiceAudioRef.current.src = url;
        voiceAudioRef.current.play();
        setPlayingVoiceIdx(idx);
        setVoiceProgress(0);
        setVoiceDuration(msg && msg.duration ? msg.duration : 0);
      }
    }
  };

  const handlePauseVoice = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      setPlayingVoiceIdx(null);
    }
  };

  const handleVoiceTimeUpdate = () => {
    if (voiceAudioRef.current) {
      setVoiceProgress(voiceAudioRef.current.currentTime);
    }
  };

  const handleVoiceEnded = () => {
    setPlayingVoiceIdx(null);
    setVoiceProgress(0);
  };

  const handleClearChat = () => {
    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId]: []
    }));
    setContextMenu({ visible: false, x: 0, y: 0, msgIdx: null });
  };

  useEffect(() => {
    if (callState === 'in-call' && localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (callState !== 'in-call' && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [callState, localStream]);

  return (
    <div className="flex mx-auto  overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="flex flex-1  justify-between gap-6 overflow-hidden">
          <div className="w-[490px] flex flex-col h-[80vh]">
            <div className="flex items-center justify-between px-6 pt-8 pb-4">
              <h2 className="font-bold text-2xl">Messages</h2>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <ListFilter size={20} />
                </span>
                <select className="p-2 rounded hover:bg-gray-100 pl-8">
                  <option value="recent">Recent</option>
                  <option value="unread">Unread</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`flex gap-3 px-6 py-4 cursor-pointer hover:bg-[#F7F7F7] ${currentChatId === chat.id ? 'bg-[#F7F7F7] border-l-4 border-[#6C5DD3]' : ''}`}
                  onClick={() => handleChatChange(chat.id)}
                >
                  <div className="bg-[#FACD5D] w-12 h-12 rounded-full flex items-center justify-center">
                    <img src={chat.avatar} alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm truncate">{chat.name}</span>
                      <span className="text-xs text-gray-400">{chat.lastOn}</span>
                    </div>
                    <div className='text-xl font-bold'>{chat.themeMsg}</div>
                    <div className="text-xs text-gray-500">{chat.lastMsg}</div>
                    {chat.tags?.length > 0 && (
                      <div className="mt-1 flex gap-2">
                        {chat.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[11px] px-2 py-0.5 rounded ${
                              tag === 'Promotion' ? 'bg-[#F3E8FF] text-[#A259FF]' : 'bg-[#FFEAEA] text-[#FF6A55]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className='border-b border-gray-200 mt-4'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[550px] h-[80vh] flex flex-col flex-1 bg-[#F7F7F7] rounded-[30px]">
            <div className="flex items-center gap-4 px-8 py-6">
              <div className="bg-[#FACD5D] w-12 h-12 rounded-full flex items-center justify-center">
                <img src={currentChat?.avatar || './User.svg'} alt="" />
              </div>
              <div>
                <div className="font-semibold">{currentChat?.name || ''}</div>
                <div className="text-xs text-gray-400">{currentChat?.lastSeen === 'online' ? 'Online' : `Last seen ${currentChat?.lastSeen}`}</div>
              </div>
              <button
                className="ml-auto bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                title="Call"
                onClick={startCall}
              >
                <Phone size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4" style={{ position: 'relative' }}>
              {messages.length === 0 && <div className="text-gray-400 text-center mt-10">No messages</div>}
              {messages.map((msg, idx) => {
                const myUserId = getCurrentUserId();
                return (
                  <div
                    key={idx}
                    className={`flex ${msg.userId === myUserId ? 'justify-end' : 'justify-start'}`}
                    onContextMenu={msg.userId === myUserId ? (e) => {
                      e.preventDefault();
                      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, msgIdx: idx });
                    } : undefined}
                    style={{ position: 'relative' }}
                  >
                    <div className={`max-w-[335px] px-4 py-2 text-[15px] break-words shadow-sm 
                      ${msg.userId === myUserId ? 'bg-[#6C5DD3] text-white rounded-2xl rounded-br-sm' : 'bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-[#E5E5E5]'}`}>
                      {editIdx === idx ? (
                        <div className="flex flex-col gap-1">
                          <input
                            className="w-full px-2 py-1 rounded text-black"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') { setEditIdx(null); setEditValue(''); }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-1">
                            <button className="text-xs text-white bg-[#6C5DD3] px-2 py-1 rounded" onClick={handleSaveEdit}>Сохранить</button>
                            <button className="text-xs text-gray-400 px-2 py-1 rounded" onClick={() => { setEditIdx(null); setEditValue(''); }}>Отмена</button>
                          </div>
                        </div>
                      ) : (
                        msg.type === 'file' ? (
                          <span className="flex items-center gap-1">
                            <Paperclip size={16} className="inline-block mr-1" />
                            <span className="underline">{msg.text.replace(/^📎\s*/, '')}</span>
                          </span>
                        ) : msg.type === 'voice' && (msg.audioUrl || msg.audioBase64) ? (
                          <div className="flex items-center gap-3 w-full">
                            <button
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${playingVoiceIdx === idx ? 'bg-[#6C5DD3] text-white' : 'bg-[#FACD5D] text-[#6C5DD3]'}`}
                              onClick={() =>
                                playingVoiceIdx === idx
                                  ? handlePauseVoice()
                                  : handlePlayVoice(msg.audioUrl, idx)
                              }
                            >
                              {playingVoiceIdx === idx ? (
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="4" height="12"/><rect x="12" y="4" width="4" height="12"/></svg>
                              ) : (
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><polygon points="5,3 19,10 5,17"/></svg>
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="w-full h-1 bg-gray-300 rounded">
                                <div
                                  className="h-1 bg-[#6C5DD3] rounded"
                                  style={{
                                    width: (msg.duration && playingVoiceIdx === idx)
                                      ? `${(voiceProgress / msg.duration) * 100}%`
                                      : '0%',
                                    transition: 'width 0.1s'
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {playingVoiceIdx === idx
                                  ? `${Math.floor(voiceProgress)} / ${Math.floor(msg.duration) || 0} сек`
                                  : (msg.duration ? `Голосовое сообщение (${Math.floor(msg.duration)} сек)` : 'Голосовое сообщение')}
                              </div>
                            </div>
                          </div>
                        ) : (
                          msg.text
                        )
                      )}
                      <div className="text-[11px] text-right mt-1 text-gray-300">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  }) : ''}
                        {msg.userId === myUserId ? ' ✓✓' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
              {contextMenu.visible && (
                <div
                  style={{
                    position: 'fixed',
                    top: contextMenu.y,
                    left: contextMenu.x,
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid #E5E5E5',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    minWidth: 120,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => handleEditMessage(contextMenu.msgIdx)}
                  >
                    Изменить
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                    onClick={() => handleDeleteMessage(contextMenu.msgIdx)}
                  >
                    Удалить
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                    onClick={handleClearChat}
                  >
                    Очистить чат
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
              <audio
                ref={voiceAudioRef}
                style={{ display: 'none' }}
                onTimeUpdate={handleVoiceTimeUpdate}
                onEnded={handleVoiceEnded}
              />
            </div>

            <div className="px-8 pb-6">
              <div className="flex gap-2 mb-3">
                {quickReplies.map((q, i) => (
                  <button key={i} onClick={() => handleQuickReply(q)} className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-full px-3 py-1 text-[13px] font-medium text-[#6C5DD3] hover:bg-[#ececec] transition-all">
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow border border-[#E5E5E5]">
                <button onClick={() => fileInputRef.current.click()}>
                  <Paperclip size={18} className="text-[#6C5DD3] mr-2" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <input
                  className="flex-1 border-none outline-none text-[15px] bg-transparent placeholder:text-[#BDBDBD]"
                  placeholder="Hi, how can we help you?"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  disabled={isRecording}
                />
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="ml-2 p-2 rounded-full bg-[#FACD5D] hover:bg-[#e6b94d] text-[#6C5DD3] flex items-center justify-center"
                    title="Голосовое сообщение"
                  >
                    <Mic size={20} />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="ml-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center animate-pulse"
                    title="Остановить запись"
                  >
                    <Square size={20} />
                  </button>
                )}
                <button onClick={sendMessage} className="ml-2 p-2 rounded-full bg-[#6C5DD3] hover:bg-[#5847c2] text-white flex items-center justify-center" disabled={isRecording}>
                  <Send size={18} />
                </button>
              </div>
            </div>
            {(callState === 'calling' || callState === 'ringing' || callState === 'in-call') && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black transition-opacity duration-300" style={{ opacity: 0.85 }} />
                <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center shadow-2xl min-w-[340px] border border-[#ececec]">
                  {callState === 'calling' && (
                    <>
                      <div className="mb-2 text-lg font-bold">Звонок...</div>
                      <div className="mb-4 text-gray-500">Ожидание ответа собеседника</div>
                      <button
                        onClick={endCall}
                        className="mt-2 px-8 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full font-semibold shadow"
                      >
                        Отменить
                      </button>
                    </>
                  )}
                  {callState === 'ringing' && (
                    <>
                      <div className="mb-2 text-lg font-bold">Входящий звонок</div>
                      <div className="mb-4 text-gray-500">Вам звонит пользователь {callFrom}</div>
                      <div className="flex gap-4">
                        <button
                          onClick={acceptCall}
                          className="px-8 py-2 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-full font-semibold shadow"
                        >
                          Ответить
                        </button>
                        <button
                          onClick={rejectCall}
                          className="px-8 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full font-semibold shadow"
                        >
                          Отклонить
                        </button>
                      </div>
                    </>
                  )}
                  {callState === 'in-call' && (
                    <>
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-52 h-52 bg-black rounded-2xl mb-4 border-4 border-[#FACD5D] shadow-lg"
                        style={{ objectFit: 'cover' }}
                      />
                      {callError && <div className="text-red-500 mb-2">{callError}</div>}
                      <button
                        onClick={endCall}
                        className="mt-2 px-8 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full font-semibold shadow"
                      >
                        Завершить звонок
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            <audio ref={audioRef} src="iphone_sms_original.mp3" preload="auto"></audio>
            <audio ref={sendAudioRef} src='./sentmessage.mp3' preload="auto" />
            <audio ref={ringtoneRef} src='./ringtone.mp3' preload="auto" loop />
            <audio ref={outgoingRef} src='./outgoing.mp3' preload="auto" loop />
          </div>
        </div>
      </div>
    </div>
  );
}
