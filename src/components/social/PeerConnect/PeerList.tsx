import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PeerCard } from "./PeerCard";

const mockPeers = [
  {
    id: "1",
    name: "Alex Thompson",
    avatar: "/placeholder.svg",
    major: "Computer Science",
    year: "Junior",
    interests: ["Programming", "AI", "Robotics"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    major: "Business Administration",
    year: "Senior",
    interests: ["Marketing", "Entrepreneurship", "Data Analytics"],
    isOnline: true,
  },
  {
    id: "3",
    name: "Jordan Lee",
    avatar: "/placeholder.svg",
    major: "Psychology",
    year: "Sophomore",
    interests: ["Research", "Neuroscience", "Mental Health"],
    isOnline: false,
  },
];

export function PeerList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeers = mockPeers.filter(
    (peer) =>
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search peers by name, major, or interests..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredPeers.map((peer) => (
            <PeerCard
              key={peer.id}
              peer={peer}
              onClick={() => console.log("Open chat with", peer.name)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
