import { useState, useRef, useEffect } from 'react'
import { Bot, User, Loader2, Plus, History, Settings, Menu, X, Trash2, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import './App.css'

// Import custom icons
import micIcon from './icons/mic.png'
import attachIcon from './icons/attach.png'
import sendIcon from './icons/send.png'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [copiedStates, setCopiedStates] = useState({})
  const [theme, setTheme] = useState('dark')
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordingIntervalRef = useRef(null)

  const allPrompts = [
    "Who was Marie Curie?",
    "How does blockchain technology work?",
    "Write a thank-you note to a fictional character.",
    "Invent a new holiday and describe its traditions.",
    "Explain quantum computing in simple terms",
    "Write a haiku about artificial intelligence",
    "What are the benefits of meditation?",
    "Create a recipe for chocolate chip cookies",
    "How do solar panels work?",
    "Write a short story about time travel",
    "What is machine learning?",
    "Design a workout routine for beginners",
    "Explain photosynthesis to a 10-year-old",
    "Write a poem about the ocean",
    "How do vaccines work?",
    "Create a budget plan for a family of four",
    "What causes climate change?",
    "Write a dialogue between two historical figures",
    "How to grow tomatoes at home",
    "Explain the theory of relativity",
    "Write a song about friendship",
    "What are the health benefits of exercise?",
    "Create a travel itinerary for Paris",
    "How do electric cars work?",
    "Write a letter to your future self",
    "What is the meaning of life?",
    "Design a garden layout for a small backyard",
    "Explain how the internet works",
    "Write a fairy tale with a modern twist",
    "How to make sourdough bread",
    "What are the signs of stress?",
    "Create a morning routine for productivity",
    "Explain the water cycle",
    "Write a comedy sketch about technology",
    "How do airplanes stay in the air?",
    "What are the benefits of reading?",
    "Design a minimalist bedroom",
    "Explain the food chain",
    "Write a motivational speech",
    "How to start a small business",
    "What causes earthquakes?",
    "Create a healthy meal plan",
    "Explain the human nervous system",
    "Write a mystery story opening",
    "How do cameras work?",
    "What are the principles of design?",
    "Design a logo for a coffee shop",
    "Explain the carbon cycle",
    "Write a love letter to nature",
    "How to learn a new language",
    "What are the benefits of music?",
    "Create a weekend project list",
    "Explain the immune system",
    "Write a science fiction story",
    "How do plants communicate?",
    "What is emotional intelligence?",
    "Design a sustainable city",
    "Explain the digestive system",
    "Write a children's story about kindness"
  ]

  // Function to shuffle array and get 4 random prompts
  const getRandomPrompts = (prompts, count) => {
    const shuffled = [...prompts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  // Get 4 random prompts on component mount
  const [suggestedPrompts] = useState(() => getRandomPrompts(allPrompts, 4))

  // Google Gemini API Key
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)



    try {
      // Simple request format for testing
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: inputMessage
              }
            ]
          }
        ]
      };



      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API')
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.candidates[0].content.parts[0].text,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please check your API key and try again.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      return true
    })
    
    setAttachedFiles(prev => [...prev, ...validFiles])
    event.target.value = '' // Reset input
  }

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSuggestedPrompt = async (prompt) => {
    const userMessage = {
      id: Date.now(),
      text: prompt,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API')
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.candidates[0].content.parts[0].text,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please check your API key and try again.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Create a message with the audio
        const audioMessage = {
          id: Date.now(),
          text: "🎤 Voice Message",
          sender: 'user',
          timestamp: new Date(),
          audioUrl: audioUrl,
          audioBlob: audioBlob
        }
        
        setMessages(prev => [...prev, audioMessage])
        setInputMessage('')
        setIsLoading(true)
        
        // Here you would typically send the audio to your AI service
        // For now, we'll simulate a response
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: "I received your voice message! Currently, I can't process audio content, but I'm here to help with text messages.",
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botResponse])
          setIsLoading(false)
        }, 2000)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setRecordingTime(0)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Sidebar functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const startNewChat = () => {
    if (messages.length > 0) {
      // Save current chat to history
      const chatTitle = messages[0]?.text?.slice(0, 30) + '...' || 'New Chat'
      const newChat = {
        id: Date.now(),
        title: chatTitle,
        messages: [...messages],
        timestamp: new Date()
      }
      setChatHistory(prev => [newChat, ...prev])
    }
    
    // Clear current chat
    setMessages([])
    setInputMessage('')
    setAttachedFiles([])
    setCurrentChatId(null)
    setIsSidebarOpen(false)
  }

  const loadChat = (chat) => {
    setMessages(chat.messages)
    setCurrentChatId(chat.id)
    setIsSidebarOpen(false)
  }

  const deleteChat = (chatId, e) => {
    e.stopPropagation()
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setMessages([])
      setCurrentChatId(null)
    }
  }

  const clearAllChats = () => {
    setChatHistory([])
    setMessages([])
    setCurrentChatId(null)
    setIsSidebarOpen(false)
  }

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const copyMessage = (messageText, messageId) => {
    copyToClipboard(messageText, `message-${messageId}`)
  }

  const copyCodeBlock = (codeText, codeId) => {
    copyToClipboard(codeText, `code-${codeId}`)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    document.body.className = newTheme
  }

  // Custom components for ReactMarkdown to add copy buttons to code blocks
  const components = {
    pre: ({ children, ...props }) => {
      const codeElement = children?.props?.children
      const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      return (
        <div className="code-block-container">
          <pre {...props}>
            {children}
          </pre>
          <button 
            className="copy-code-btn"
            onClick={() => copyCodeBlock(codeElement, codeId)}
            title="Copy code"
          >
            {copiedStates[`code-${codeId}`] ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )
    }
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Mirage</h2>
          <button className="close-sidebar-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <button className="new-chat-btn" onClick={startNewChat}>
              <Plus size={16} />
              New Chat
            </button>
          </div>
          
          <div className="sidebar-section">
            <h3>Chat History</h3>
            <div className="chat-history">
              {chatHistory.length === 0 ? (
                <p className="no-chats">No previous chats</p>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="chat-item-content">
                      <span className="chat-title">{chat.title}</span>
                      <span className="chat-time">
                        {chat.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => deleteChat(chat.id, e)}
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {chatHistory.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllChats}>
                Clear All Chats
              </button>
            )}
          </div>
          
          <div className="sidebar-section">
            <h3>Settings</h3>
            <div className="settings-item">
              <span>Theme</span>
              <select className="theme-select" onChange={(e) => handleThemeChange(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Container */}
      <div className="chat-container">
        <div className="chat-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <h1>Mirage</h1>
        </div>

        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="bot-avatar">
              <Bot size={48} />
            </div>
            <h2 className="welcome-title">How can I help you today?</h2>
            <div className="suggested-prompts">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="prompt-button"
                  onClick={() => handleSuggestedPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.sender === 'bot' ? (
                      <div className="bot-message-content">
                        <ReactMarkdown components={components}>{message.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="user-message-content">
                        <div>
                          {message.text}
                          {message.audioUrl && (
                            <div className="audio-message">
                              <audio controls className="audio-player">
                                <source src={message.audioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="loading-indicator">
                    <Loader2 className="loading-icon" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-container">
          {/* File attachments display */}
          {attachedFiles.length > 0 && (
            <div className="attached-files">
              {attachedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Mirage..."
              disabled={isLoading}
              rows={1}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="attach-button"
              disabled={isLoading}
              title="Attach files"
            >
              <img src={attachIcon} alt="Attach" className="custom-icon" />
            </button>
            
            <button
              onClick={handleVoiceButtonClick}
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              disabled={isLoading}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              <img src={micIcon} alt="Voice" className="custom-icon" />
              {isRecording && (
                <div className="recording-indicator">
                  <div className="recording-dot"></div>
                  <span className="recording-time">{recordingTime}s</span>
                </div>
              )}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={(!inputMessage.trim() && attachedFiles.length === 0) || isLoading}
              className="send-button"
              title="Send message"
            >
              <img src={sendIcon} alt="Send" className="custom-icon" />
            </button>
          </div>
          
          <div className="disclaimer">
            Mirage can make mistakes. Consider checking important information.
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
          />
        </div>
      </div>
    </div>
  )
}

export default App
