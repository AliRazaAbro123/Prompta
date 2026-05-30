const Interaction = require("../models/like"); // like.js
const Copy = require("../models/copytracking"); // copytracking.js
const Prompt = require("../models/prompt");
const { v4: uuidv4 } = require("uuid");

// ─── Helper: cookie se anonymousId lo ya banao ───────────────────────────────
const getOrCreateAnonymousId = (req, res) => {
  let id = req.cookies?.anonymousId;
  if (!id) {
    id = uuidv4();
    res.cookie("anonymousId", id, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 saal
      httpOnly: true,
      sameSite: "lax",
      // secure: true,  // production (HTTPS) pe uncomment karo
    });
  }
  return id;
};

// ─── POST /api/interactions/like/:promptId  — Like toggle ────────────────────
exports.toggleLike = async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.user?._id ?? null;
    const anonymousId = userId ? null : getOrCreateAnonymousId(req, res);

    const filter = {
      prompt: promptId,
      type: "like",
      ...(userId ? { user: userId } : { anonymousId }),
    };

    const existing = await Interaction.findOne(filter);

    let liked;
    if (existing) {
      await Interaction.deleteOne({ _id: existing._id });
      liked = false;
    } else {
      await Interaction.create(filter);
      liked = true;
    }

    const likeCount = await Interaction.countDocuments({
      prompt: promptId,
      type: "like",
    });

    res.status(200).json({ liked, likeCount });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ─── GET /api/interactions/like/:promptId  — Like status + count ─────────────
exports.getLikeStatus = async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.user?._id ?? null;
    const anonymousId = req.cookies?.anonymousId ?? null;

    const filter = {
      prompt: promptId,
      type: "like",
      ...(userId
        ? { user: userId }
        : anonymousId
          ? { anonymousId }
          : { anonymousId: "__none__" }), // koi match nahi milega
    };

    const [existing, likeCount] = await Promise.all([
      Interaction.findOne(filter),
      Interaction.countDocuments({ prompt: promptId, type: "like" }),
    ]);

    res.status(200).json({ liked: !!existing, likeCount });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ─── POST /api/interactions/copy/:promptId  — Copy + track ───────────────────
exports.trackCopy = async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.user?._id ?? null;
    const anonymousId = userId ? null : getOrCreateAnonymousId(req, res);

    // Prompt text fetch karo
    const prompt = await Prompt.findById(promptId).select("+promptText");
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Har copy track hogi (multiple allowed)
    await Copy.create({ prompt: promptId, user: userId, anonymousId });

    const copyCount = await Copy.countDocuments({ prompt: promptId });

    res.status(200).json({ promptText: prompt.promptText, copyCount });
  } catch (err) {
    console.error("trackCopy error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
