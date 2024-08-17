'use client'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Auth() {
    const { isAuthenticated, user } = useAuth0();
    useEffect(() => {
      if (isAuthenticated && user) {
        const saveUserToDatabase = async () => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name,
                  picture: user.picture,
                  sub: user.sub, // Auth0 user ID
                }),
              }
            );
  
            const data = await response.json();
            if (!data.success) {
              console.error('Error saving user to database:', data.message);
            }
          } catch (error) {
            console.error('Error saving user to database:', error);
          }
        };
  
        saveUserToDatabase();
      }
    }, [isAuthenticated, user]);
    return <></>;
  }
  