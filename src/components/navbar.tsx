'use client';
import Link from 'next/link';
import LoginButton from './login';
import Profile from './profile';
import { useAuth0 } from '@auth0/auth0-react';
import Image from 'next/image';

export default function Navbar() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className='bg-white shadow p-4 flex justify-between'>
      <div>
        <Link href='/' className='flex items-center'>
          <Image
            src='/logo.png'
            alt='Travel Application Logo'
            width={60}
            height={60}
            className='rounded-full'
          />
          <h1 className='font-bold text-2xl '>Traventure</h1>
        </Link>
      </div>
      <div>
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && <Profile />}
      </div>
    </div>
  );
}
