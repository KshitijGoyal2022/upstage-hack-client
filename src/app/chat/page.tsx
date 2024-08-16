'use client';
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

import io from 'socket.io-client';

interface Message {
  text: string;
  sender: string | null;
  timestamp: string;
  username: string | null;
}

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001');

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Listen for connection event
    socket.on('connect', () => {
      const id = socket.id || null;
      setSocketId(id);
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

    if (message.trim() && socketId) {
      const newMessage: Message = {
        text: message,
        sender: socketId,
        timestamp: new Date().toLocaleTimeString(),
        username: socketId,
      };

      socket.emit('message', newMessage);
      setMessage(''); // Clear the input after submission
    }
  };

  // Show a loading indicator until the socket connection is established
  if (!isConnected) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Connecting to the chat...</p>
      </div>
    );
  }

  return (
    <div className='grid h-screen w-full pl-[56px]'>
      <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
        <div className='border-b p-2'>
          <Button variant='outline' size='icon' aria-label='Home'>
            <Triangle className='size-5 fill-foreground' />
          </Button>
        </div>
        <nav className='grid gap-1 p-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg bg-muted'
                  aria-label='Playground'
                >
                  <SquareTerminal className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Playground
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg'
                  aria-label='Models'
                >
                  <Bot className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Models
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg'
                  aria-label='API'
                >
                  <Code2 className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                API
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg'
                  aria-label='Documentation'
                >
                  <Book className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Documentation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg'
                  aria-label='Settings'
                >
                  <Settings2 className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className='mt-auto grid gap-1 p-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='mt-auto rounded-lg'
                  aria-label='Help'
                >
                  <LifeBuoy className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='mt-auto rounded-lg'
                  aria-label='Account'
                >
                  <SquareUser className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className='flex flex-col'>
        <main className='flex-1 gap-4 overflow-auto p-4'>
          <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>

            {/* Output Area */} 
            <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === socketId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-t-lg ${
                      msg.sender === socketId
                        ? 'rounded-bl-lg bg-gray-800 text-white'
                        : 'rounded-br-lg bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <p className='text-sm'>{msg.text}</p>
                    <span className='block mt-1 text-xs text-gray-500'>
                      {msg.username} ● {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Typing Indicator */}
            <div className='px-4 pb-2 text-sm text-gray-500'>
              {message && <span>{socketId} is typing...</span>}
            </div>

            <form
              className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'
              x-chunk='dashboard-03-chunk-1'
              onSubmit={handleSubmit}
            >
              <Label htmlFor='message' className='sr-only'>
                Message
              </Label>
              <Textarea
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
  );
}
