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
        <Link href='/'>
          <Image
            src='/logo.webp'
            alt='Travel Application Logo'
            width={40}
            height={40}
            className='rounded-full'
          />
        </Link>
      </div>
      <div>
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && <Profile />}
      </div>
    </div>
  );
}
