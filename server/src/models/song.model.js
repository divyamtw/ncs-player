import { Schema, model } from "mongoose";

const songSchema = new Schema(
  {
    trackId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      trim: true,
      default: "Unknown",
    },

    mp3: {
      type: String,
      required: true,
    },

    cover: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "Admin",
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isCustom: {
      type: Boolean,
      default: true,
    },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

songSchema.index({ title: "text", artist: "text" });

const Song = model("Song", songSchema);
export default Song;
