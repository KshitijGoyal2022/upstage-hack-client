'use client';
import LoginButton from './login';
import Profile from './profile';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className='bg-white shadow p-4 flex justify-end'>
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && <Profile />}
    </div>
  );
}
