import prisma from "../utils/prisma.js";

const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subjectName = name.trim();

    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: subjectName,
        userId: req.user.userId,
      },
    });

    if (existingSubject) {
      return res.status(409).json({
        message: "Subject already exists",
      });
    }

    const subject = await prisma.subject.create({
      data: {
        name: subjectName,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectId = Number(req.params.id);

    if (Number.isNaN(subjectId)) {
      return res.status(400).json({
        message: "Invalid subject ID",
      });
    }

    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        userId: req.user.userId,
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createSubject, getSubjects, deleteSubject };
