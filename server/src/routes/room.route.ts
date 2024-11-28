import { Router } from "express";
import { createRoom } from "../controllers/room.controller";

const router = Router()

router.route("/create").post(createRoom)

export default router