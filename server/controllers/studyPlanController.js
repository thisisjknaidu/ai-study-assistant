import prisma from "../utils/prisma.js";

const createStudyTask = async (req, res) => {
  try {
    const { title, subject, description, dueDate } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        message: "Title, subject and due date are required",
      });
    }

    // Check that the selected subject belongs to the logged-in user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: subject,
        userId: req.user.userId,
      },
    });

    if (!existingSubject) {
      return res.status(400).json({
        message: "Please select a valid subject",
      });
    }

    const task = await prisma.studyTask.create({
      data: {
        title,
        subject,
        description: description || null,
        dueDate: new Date(dueDate),
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Study task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create study task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getStudyTasks = async (req, res) => {
  try {
    const tasks = await prisma.studyTask.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    res.json({
      tasks,
    });
  } catch (error) {
    console.error("Get study tasks error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateStudyTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await prisma.studyTask.findFirst({
      where: {
        id: taskId,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Study task not found",
      });
    }

    const updatedTask = await prisma.studyTask.update({
      where: {
        id: taskId,
      },
      data: {
        completed: !task.completed,
      },
    });

    res.json({
      message: "Study task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update study task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteStudyTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await prisma.studyTask.findFirst({
      where: {
        id: taskId,
        userId: req.user.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Study task not found",
      });
    }

    await prisma.studyTask.delete({
      where: {
        id: taskId,
      },
    });

    res.json({
      message: "Study task deleted successfully",
    });
  } catch (error) {
    console.error("Delete study task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createStudyTask, getStudyTasks, updateStudyTask, deleteStudyTask };
