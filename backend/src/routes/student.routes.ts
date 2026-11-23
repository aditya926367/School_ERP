
import express from "express";
import prisma from "../db";

const router = express.Router();

router.get("/students", async (req, res) => {
  try {
    const students = await prisma.students.findMany();

    res.json(students);
  } catch (error) {
    console.error("STUDENT FETCH ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch students",
    });
  }
});

export default router;
