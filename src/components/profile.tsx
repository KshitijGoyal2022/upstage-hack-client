import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
          className="flex items-center space-x-4 rounded-lg cursor-pointer"
          onClick={handleToggle}
        >
          <Avatar>
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="px-4 py-2">
              <h2 className="text-md font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="border-t border-gray-200"></div>
            <LogoutButton />
          </div>
        )}
      </div>
    )
  );
};

export default Profile;
