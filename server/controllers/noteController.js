import prisma from "../utils/prisma.js";

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);

    if (Number.isNaN(noteId)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createNote, getNotes, deleteNote };
