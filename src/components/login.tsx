import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();


  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

export default LoginButton;
