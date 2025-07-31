# AI Chatbot with Vite + React

A modern, responsive AI chatbot built with Vite, React, and Google's Gemini API. Features a beautiful UI with real-time messaging, loading states, and mobile responsiveness.

## Features

- 🤖 **AI-Powered Conversations**: Powered by Google's Gemini Pro model
- 💬 **Real-time Messaging**: Instant message exchange with the AI
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Development**: Built with Vite for lightning-fast development
- 🔄 **Loading States**: Visual feedback during AI processing
- ⌨️ **Keyboard Shortcuts**: Press Enter to send messages
- 📜 **Auto-scroll**: Automatically scrolls to latest messages

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google AI API key (Gemini)

## Setup Instructions

### 1. Clone or Download the Project

```bash
# If you have this as a git repository
git clone <repository-url>
cd ai-chatbot

# Or if you downloaded the files directly
cd ai-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your API Key

Open `src/App.jsx` and replace the placeholder API key:

```javascript
// Replace this line in src/App.jsx
const API_KEY = 'your-google-api-key-here'

// With your actual Google AI API key
const API_KEY = 'AIzaSy...'
```

**Important**: 
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Keep your API key secure and never commit it to version control
- The API key is currently hardcoded in the application as requested

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Usage

1. **Start a Conversation**: The chatbot will greet you with a welcome message
2. **Type Your Message**: Use the text area at the bottom to type your message
3. **Send Messages**: Click the send button or press Enter to send your message
4. **Wait for Response**: The AI will process your message and respond
5. **Continue Chatting**: Keep the conversation going with follow-up questions

## API Configuration

The chatbot uses Google's Gemini API with the following settings:

- **Model**: `gemini-pro`
- **Max Output Tokens**: 500
- **Temperature**: 0.7
- **Top-K**: 40
- **Top-P**: 0.95
- **System Prompt**: "You are a helpful AI assistant. Provide clear, concise, and helpful responses."

You can modify these settings in the `sendMessage` function in `src/App.jsx`.

## Project Structure

```
ai-chatbot/
├── src/
│   ├── App.jsx          # Main chatbot component
│   ├── App.css          # Chatbot styling
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Customization

### Changing the AI Model

To use a different Google Gemini model, modify the API URL:

```javascript
// For Gemini 1.5 Pro
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'

// For Gemini 1.5 Flash
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
```

### Modifying the System Prompt

Update the system message to change the AI's behavior:

```javascript
{
  role: 'system',
  content: 'You are a specialized AI assistant for [your domain]. [Your custom instructions]'
}
```

### Styling Customization

The chatbot uses CSS custom properties and modern styling. You can customize:

- Colors: Modify the gradient values in `.app` and `.chat-header`
- Fonts: Change the `font-family` in `:root`
- Layout: Adjust the `max-width` and `height` values in `.chat-container`

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your Google AI API key is valid and has sufficient quota
2. **CORS Issues**: The application makes direct API calls to Google AI, which should work in modern browsers
3. **Network Errors**: Check your internet connection and Google AI API status

### Error Messages

- "Sorry, I'm having trouble connecting right now": Usually indicates an API key issue or network problem
- Check the browser console for detailed error information
- Google AI API errors will show specific error codes in the console

## Security Notes

⚠️ **Important**: The API key is currently hardcoded in the frontend code as requested. For production use, consider:

- Moving the API key to environment variables
- Using a backend proxy to handle API calls
- Implementing proper authentication and rate limiting
- Google AI API has generous free tier limits

## Dependencies

- **React**: UI framework
- **Vite**: Build tool and development server
- **Lucide React**: Icon library
- **Axios**: HTTP client (installed but not currently used - can be used for API calls)

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Verify your OpenAI API key and credits
3. Check the browser console for error messages
4. Ensure all dependencies are properly installed

---

**Happy Chatting! 🤖✨**
