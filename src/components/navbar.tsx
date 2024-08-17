'use client';
import { MenuIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import LoginButton from './login';
import LogoutButton from './logout';
import Profile from './profile';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className='bg-white shadow'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            {/* Mobile menu button */}
            <Button className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <MenuIcon
                aria-hidden='true'
                className='block h-6 w-6 group-data-[open]:hidden'
              />
              <X
                aria-hidden='true'
                className='hidden h-6 w-6 group-data-[open]:block'
              />
            </Button>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex flex-shrink-0 items-center'>
              {/* <img
                alt="Your Company"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              /> */}
            </div>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {!isAuthenticated && <LoginButton />}
            {isAuthenticated && <Profile />}

            {/* Profile dropdown */}
          </div>
        </div>
      </div>
    </div>
  );
}
