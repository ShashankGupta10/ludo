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
import { useContext, useState } from "react";
import { DataContext } from "@/context/DataContext";
import ludoBg from "/ludo-bg.png";

const Home = () => {
  const [roomId, setRoomId] = useState("")
  const { data, setData } = useContext(DataContext)
  const navigate = useNavigate();
  
  const createRoom = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/room/create"
    );
    navigate(`/waiting-area/${response.data.id}`);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center gap-16 items-center bg-yellow-500">
      <img src={ludoBg} alt="" />
      <div className="flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-red-600 w-48 animate-bounce text-xl hover:bg-red-500" size={"xl"}>Join Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription>
              Enter the room id to join the Game Room.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 items-center">
            <div className="grid flex-1 w-full">
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
            <div className="grid flex-1 w-full">
              <Label htmlFor="link" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-700 hover:bg-blue-600 w-48 animate-bounce delay-200 text-xl" size={"xl"}>Create Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Enter your name to create a ludo game room with you as the admin
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="default" className="ml-auto" onClick={createRoom}>
                Create Room
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default Home;
