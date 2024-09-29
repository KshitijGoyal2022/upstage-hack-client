'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TranslationChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  // Toggle chat window visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Detect the language of the input text
  const detectLanguage = (text: string): 'koen' | 'enko' => {
    const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // Matches Korean characters
    return koreanPattern.test(text) ? 'koen' : 'enko';
  };

  // Handle translation request
  const handleTranslate = async () => {
    if (!message.trim()) return; // Prevent empty submissions

    const direction = detectLanguage(message);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/translation?q=${encodeURIComponent(message)}&direction=${direction}`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        setConversation(data); // Assuming the response is the full conversation array
        setMessage(''); // Clear the input after sending the message
      } else {
        console.error('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          className='fixed bottom-6 left-6 bg-indigo-500  text-white rounded-full p-4 w-12 h-12 shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none'
          onClick={toggleChat}
        >
          💬
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-16 left-6 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex flex-col'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex flex-col items-center w-full'>
              <h2 className='font-semibold text-lg'>
                Translation Aid
              </h2>
              <h2 className='font-medium text-sm text-gray-500'>
                영한 번역 지원
              </h2>
            </div>

            <Button
              className='text-gray-500 focus:outline-none'
              onClick={toggleChat}
              variant='ghost'
            >
              ✖
            </Button>
          </div>

          <div className='flex-grow overflow-y-auto mb-4 bg-gray-50 p-3 rounded-lg'>
            {/* Display the entire conversation */}
            {conversation.length > 0 ? (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 max-w-xs rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-100 self-end text-right'
                      : 'bg-gray-200 self-start text-left'
                  }`}
                >
                  <div className='flex'>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='mb-2 p-2 max-w-xs rounded-lg bg-gray-200 self-start text-left'>
                <div className='flex'>
                  <p>Type English, Get Korean</p>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Input
              type='text'
              placeholder='Type your message...'
              value={message}
              onChange={handleInputChange}
              className='flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <Button
              className='bg-indigo-500 text-white rounded-lg p-2 hover:bg-indigo-600 transition-colors duration-300'
              onClick={handleTranslate}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationChat;
