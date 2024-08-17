import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Button } from './ui/button';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant='ghost'
      className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg'
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL as string,
          },
        })
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
