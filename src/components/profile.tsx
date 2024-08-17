import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import LogoutButton from './logout';

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  return (
    isAuthenticated && (
      <div className="relative">
        <div
          className="flex items-center space-x-2 rounded-lg cursor-pointer hover:bg-gray-100 p-2"
          onClick={handleToggle}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
            </div>
            <div className="border-t border-gray-200"></div>
          <LogoutButton/>
          </div>
        )}
      </div>
    )
  );
};

export default Profile;
