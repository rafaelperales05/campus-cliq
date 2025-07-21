import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PeerList } from "./PeerList";
import { PeerChatInterface } from "./PeerChatInterface";
import { useState } from "react";

interface ChatLayoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatLayout({ isOpen, onOpenChange }: ChatLayoutProps) {
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Campus Connect</SheetTitle>
          <SheetDescription>
            Connect with fellow students and build your campus network
          </SheetDescription>
        </SheetHeader>
        {selectedPeerId ? (
          <PeerChatInterface recipientId={selectedPeerId} />
        ) : (
          <PeerList />
        )}
      </SheetContent>
    </Sheet>
  );
}
