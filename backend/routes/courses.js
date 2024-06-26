const express = require("express");
const router = express.Router();

const userModel = require("../models/user");
const { topicsModel } = require("../models/topics");

router.post("/getModules", async (req, res) => {
  const { courses } = req.body;

  try {
    // Handle cases where courses is not an array
    if (!Array.isArray(courses)) {
      return res
        .status(400)
        .json({ message: "Invalid courses data. Must be an array." });
    }

    // Efficiently filter topics using aggregation framework:
    const topics = await topicsModel.aggregate([
      {
        $match: {
          $or: [
            { sourceKey: { $nin: courses } }, // Exclude topics not in courses (userNotStarted)
            { sourceKey: { $in: courses } }, // Include topics in courses (userInProgress)
          ],
        },
      },
    ]);

    const userInProgress = topics.filter((topic) =>
      courses.includes(topic.sourceKey)
    ); // Filter topics in progress
    const userNotStarted = topics.filter(
      (topic) => !courses.includes(topic.sourceKey)
    ); // Filter topics not started

    res.json({ userInProgress, userNotStarted }); // Send categorized topics
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching topics" });
  }
});

router.post("/getLessons", async (req, res) => {
  try {
    const { topic } = req.body; // Destructure topic from request body

    if (!topic) {
      return res.status(400).send("Missing required field: topic");
    }

    const foundTopic = await topicsModel.findOne({
      sourceKey: topic,
    }); // Find topic with matching topic

    if (!foundTopic) {
      return res.status(404).send("No lesson progress found for that topic");
    }

    res.json(foundTopic.topicLesson); // Send the topic lessons
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/updateTopics", async (req, res) => {
  const { sourceKey, lessonTitleArr, topic } = req.body;

  // Validate input (optional but recommended)
  if (!sourceKey || !lessonTitleArr || !topic) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const lessonArr = lessonTitleArr.map((lessonTitleStr) => ({
    lessonTitle: lessonTitleStr,
    lessonBody: {},
  })); // Create an array of lesson objects

  try {
    const updatedTopic = await topicsModel.findOne({ sourceKey });

    const topicLessonAppend = {
      topic,
      lessons: lessonArr,
    };

    updatedTopic.topicLesson.push(topicLessonAppend); // Append to the topicLesson array

    await updatedTopic.save(); // Save the updated topic

    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ message: "Topic lessons updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating topic lessons" });
  }
});

router.post("/getProgress", async (req, res) => {
  const mongoose = require("mongoose");
  const isValidObjectId = mongoose.Types.ObjectId.isValid;

  const { sourceKey, userID } = req.body;

  if (!sourceKey || !userID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!isValidObjectId(userID)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }

  try {
    const user = await userModel.findById(userID);

    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProgress = user.lesson.find(
      (lesson) => lesson.source === sourceKey
    );

    for (const topic of userProgress.topicLesson) {
      for (const lesson of topic.lessonProgress) {
        totalLessonsCount++;
        if (lesson.completed) {
          completedLessonsCount++;
        }
      }
    }

    const progress = {
      sourceKey: sourceKey,
      noOfLessonCount: totalLessonsCount,
      completedLessonCount: completedLessonsCount,
    };

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user progress" });
  }
});

module.exports = router;
