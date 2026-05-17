const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const Project = require("../models/Project");

// Protect all project routes
router.use(protect);

async function saveProject(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const project = await Project.create({ 
      title, 
      description,
      user: req.user.id
    });

    return res.status(201).json({
      message: "Project Saved",
      project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

// Save project
router.post("/save", saveProject);

// Get all projects for logged in user
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check for user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const { title, description } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check for user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized" });
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.json({ message: "Deleted", id: req.params.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
