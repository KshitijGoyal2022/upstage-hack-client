'use client';
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

import io from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import Sidebar from '@/components/sidebar';

interface Message {
  text: string;
  // itinerary: IItinerary;
  creator: string | null;

  createdAt: string;
  // updatedAt: string;
}

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001'
);

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Listen for connection event
    socket.on('connect', () => {
      setIsConnected(true);
    });

    // Listen for messages
    socket.on('message', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (message.trim() && user?.sub) {
      const newMessage: Message = {
        text: message,
        creator: user.sub,
        createdAt: new Date().toLocaleTimeString(),
      };

      socket.emit('message', newMessage);
      setMessage(''); // Clear the input after submission
    }
  };

  return (
    <div className=''>
      <div className='flex'>
        <Sidebar />
        <div className='flex flex-col h-[800px] w-full'>
          <main className='flex-1 gap-4 overflow-auto p-4'>
            <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
              {/* Output Area */}
              <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.creator === user?.sub
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-t-lg ${
                        msg.creator === user?.sub
                          ? 'rounded-bl-lg bg-gray-800 text-white'
                          : 'rounded-br-lg bg-white text-gray-800 shadow-md'
                      }`}
                    >
                      <p className='text-sm'>{msg.text}</p>
                      <span className='block mt-1 text-xs text-gray-500'>
                        {msg.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Typing Indicator */}
              <div className='px-4 pb-2 text-sm text-gray-500'>
                {message && <span>{user?.name} is typing...</span>}
              </div>

              <form
                className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'
                x-chunk='dashboard-03-chunk-1'
                onSubmit={handleSubmit}
              >
                <Label htmlFor='message' className='sr-only'>
                  Message
                </Label>
                <Input
                  id='message'
                  placeholder='Type your message here...'
                  className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className='flex items-center p-3 pt-0'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <Paperclip className='size-4' />
                          <span className='sr-only'>Attach file</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>Attach File</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <Mic className='size-4' />
                          <span className='sr-only'>Use Microphone</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>Use Microphone</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button type='submit' size='sm' className='ml-auto gap-1.5'>
                    Send Message
                    <CornerDownLeft className='size-3.5' />
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
