import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL as string } })}>
      Log Out
    </Button>
  );
};

export default LogoutButton;