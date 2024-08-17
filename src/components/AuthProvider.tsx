'use client';  // This directive makes the component a client-side component

import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL as string,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
