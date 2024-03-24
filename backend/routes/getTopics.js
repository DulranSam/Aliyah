const express = require("express");
const router = express.Router();
const { topicsModel } = require("../models/topics");
const userModel = require("../models/user");

router.route("/").post(async (req, res) => {
  const { sourceKey } = req?.body;

  if (!sourceKey)
    return res.status(400).json({ Alert: "The topic source is missing!" });

  const topicData = await topicsModel.findOne({ sourceKey });

  if (!topicData) {
    res
      .status(400)
      .json({ Alert: "The question data is not matching records." });
  } else {
    res.status(200).json(topicData);
  }
});

router.route("/getModuleProbs").post(async (req, res) => {
  const { username } = req?.body;

  if (!username)
    return res.status(400).json({ Alert: "The username is missing!" });
  const probData = await userModel.findOne({ username });

  if (!probData) {
    res
      .status(400)
      .json({ Alert: "The question data is not matching records." });
  } else {
    res.status(200).json(probData);
  }
});

router.post("/getLessons", async (req, res) => {
  try {
    const { sourceKey, topic } = req.body;

    if (!sourceKey || !topic) {
      return res
        .status(400)
        .json({ message: "Missing required fields: sourceKey or topic" });
    }

    // Efficiently find topic using aggregation pipeline
    const pipeline = [
      {
        $match: {
          sourceKey,
        },
      },
      {
        $unwind: "$topicLesson",
      },
      {
        $match: {
          "topicLesson.topic": topic,
        },
      },
      {
        $project: {
          lessons: "$topicLesson.lessons",
        },
      },
    ];

    const [foundTopic] = await topicsModel.aggregate(pipeline);

    if (!foundTopic) {
      return res.status(404).json({ message: "Source key or topic not found" });
    }

    const lessons = foundTopic.lessons; // Extract lessons from the result

    res.json({ lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/setLessons", async (req, res) => {
  const { sourceKey, topic, lessonTitle, lessonBody } = req.body;

  if (!sourceKey || !topic || !lessonTitle || !lessonBody) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedTopic = await topicsModel.findOne({
      sourceKey,
    });

    if (!updatedTopic) {
      return res
        .status(404)
        .json({ message: "Source, topic, or lesson not found" });
    }

    for (const topicLesson of updatedTopic.topicLesson) {
      if (topicLesson.topic === topic) {
        for (const lesson of topicLesson.lessons) {
          if (lesson.lessonTitle === lessonTitle) {
            lesson.lessonBody = lessonBody;
            break;
          }
        }
      }
    }

    await updatedTopic.save();

    res.json({ message: "Lesson body updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/getModuleProbs").post(async (req, res) => {
  const { username } = req?.body;

  if (!username)
    return res.status(400).json({ Alert: "The username is missing!" });
  const probData = await userModel.findOne({ username });

  if (!probData) {
    res
      .status(400)
      .json({ Alert: "The question data is not matching records." });
  } else {
    res.status(200).json(probData);
  }
});

router.route("/getTopicKeyFromTopic").post(async (req, res) => {
  const { source, topic } = req?.body;

  if (!source || !topic)
    return res.status(400).json({ Alert: "The source is missing!" });

  const sourceKey = await topicsModel.findOne(
    { source: source },
    { topics: 1, topicKeys: 1, sourceKey: 1, _id: 0 }
  );

  let topics = sourceKey.topics;
  let topicKeys = sourceKey.topicKeys;
  let topicKeyReturned = "";
  let sourceKeyReturned = sourceKey.sourceKey;

  console.log(topics);
  console.log(topicKeys);

  for (const i in topics) {
    if (topics[i] === topic) {
      topicKeyReturned = topicKeys[i];
    }
  }

  const keyObject = {
    topicKey: topicKeyReturned,
    sourceKey: sourceKeyReturned,
  };

  if (!sourceKey) {
    res
      .status(400)
      .json({ Alert: "The question data is not matching records." });
  } else {
    res.status(200).json(keyObject);
  }
});

module.exports = router;
