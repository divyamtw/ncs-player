import express from "express";
import {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  togglePopular,
} from "../controllers/song.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes — anyone can read songs
router.get("/", getAllSongs);
router.get("/:id", getSongById);

// Protected admin routes — require auth
router.post("/", verifyUser, createSong);
router.put("/:id", verifyUser, updateSong);
router.delete("/:id", verifyUser, deleteSong);
router.patch("/:id/toggle-popular", verifyUser, togglePopular);

export default router;
