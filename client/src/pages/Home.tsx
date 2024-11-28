import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [roomId, setRoomId] = useState("")
  const navigate = useNavigate();
  
  const createRoom = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/room/create"
    );
    navigate(`/waiting-area/${response.data.id}`);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Join Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription>
              Enter the room id to join the Game Room.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                placeholder="Enter the id..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="default" className="ml-auto" onClick={() => navigate(`/waiting-area/${roomId}`)}>
                Join Room
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button onClick={createRoom}>Create Room</Button>
    </div>
  );
};

export default Home;
