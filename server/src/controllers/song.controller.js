import Song from "../models/song.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/songs
 * Fetch all songs with optional pagination, search, and filter.
 */
export const getAllSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const source = req.query.source || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
      ];
    }

    if (genre) filter.genre = { $regex: genre, $options: "i" };
    if (source) filter.source = source;

    const total = await Song.countDocuments(filter);
    const songs = await Song.find(filter)
      .populate("addedBy", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: songs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch songs" });
  }
};

/**
 * GET /api/songs/:id
 * Fetch a single song by MongoDB ObjectId.
 */
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate("addedBy", "username email");
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }
    return res.status(200).json({ success: true, data: song });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch song" });
  }
};

/**
 * POST /api/songs
 * Admin: Create a new custom song entry.
 */
export const createSong = async (req, res) => {
  try {
    const { title, artist, genre, mp3, cover, duration, isPopular } = req.body;

    if (!title || !artist || !mp3) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and mp3 URL are required",
      });
    }

    const trackId = `admin-${uuidv4()}`;

    const song = await Song.create({
      trackId,
      title,
      artist,
      genre: genre || "Unknown",
      mp3,
      cover: cover || "",
      duration: duration || "",
      isPopular: isPopular || false,
      source: "Admin",
      isCustom: true,
      addedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: song,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Song with this trackId already exists" });
    }
    return res.status(500).json({ success: false, message: "Failed to create song" });
  }
};

/**
 * PUT /api/songs/:id
 * Admin: Update an existing song.
 */
export const updateSong = async (req, res) => {
  try {
    const { title, artist, genre, mp3, cover, duration, isPopular } = req.body;

    const song = await Song.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(artist && { artist }),
        ...(genre && { genre }),
        ...(mp3 && { mp3 }),
        ...(cover !== undefined && { cover }),
        ...(duration !== undefined && { duration }),
        ...(isPopular !== undefined && { isPopular }),
      },
      { new: true, runValidators: true }
    );

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Song updated successfully",
      data: song,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to update song" });
  }
};

/**
 * DELETE /api/songs/:id
 * Admin: Delete a song by ID.
 */
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }
    return res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to delete song" });
  }
};

/**
 * PATCH /api/songs/:id/toggle-popular
 * Admin: Toggle isPopular flag.
 */
export const togglePopular = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    song.isPopular = !song.isPopular;
    await song.save();

    return res.status(200).json({
      success: true,
      message: `Song marked as ${song.isPopular ? "popular" : "not popular"}`,
      data: song,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to toggle popular status" });
  }
};
