// src/components/social/PeerConnect.tsx (Updated PeerConnectButton)

import { UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PeerConnectButtonProps {
  // Change prop to a standard onClick handler
  onClick?: () => void;
}

// No more Dialog wrapper, this is just a button now.
export function PeerConnectButton({ onClick }: PeerConnectButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="lg"
      className="fixed bottom-6 right-6 gap-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90"
    >
      <UserPlus2 className="w-5 h-5" />
      <span>Find Peers</span>
    </Button>
  );
}

// ChatLayout remains the same
export { ChatLayout } from "./ChatLayout"; // Assuming ChatLayout is in its own file