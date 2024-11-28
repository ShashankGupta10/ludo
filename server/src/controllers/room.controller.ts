import { Request, Response } from "express";
import { v4 as uuid } from "uuid"
export const createRoom = async (req: Request, res: Response) => {
    const roomId = uuid()
    
    res.status(200).json({ message: "Room created successfully", id: roomId });
};

