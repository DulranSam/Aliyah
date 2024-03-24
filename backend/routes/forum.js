const express = require("express");
const router = express.Router();
const forumModel = require("../models/forum");
const userModel = require("../models/user");

router.route("/").post(async (req, res) => {
  const { searchParams } = req.body;

  if (!searchParams) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }

  try {
    if (searchParams && searchParams.trim() !== "") {
      const forums = await forumModel.find({ topic: searchParams });

      console.log(forums);

      if (forums.length === 0) {
        return res.status(404).json({ message: "No results found!" });
      } else {
        res.status(200).json(forums);
      }
    } else {
      const forums = await forumModel.find(); // Get all forums if no search params
      res.status(200).json(forums);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching forums" });
  }
});

router.route("/addQuestion").post(async (req, res) => {
  try {
    const { question, description, topic, by } = req?.body;

    if (!question || !topic) {
      return res.status(400).json({ Alert: "NO Question/Topic!" });
    }

    const conflict = await forumModel.findOne({ question });

    if (conflict) {
      return res
        .status(409)
        .json({ Alert: `${question} was Already posted before!` });
    }

    const created = await forumModel.create({
      question,
      description,
      topic,
      by,
    });

    if (created) {
      return res.status(201).json({ Alert: `${question} Added!` });
    } else {
      return res.status(500).json({ Alert: "Failed to create the question." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ Alert: "An error occurred while processing your request." });
  }
});

router.route("/addAnswerToQuestion").post(async (req, res) => {
  const { questionId, answer, answeredBy } = req.body;

  if (!questionId || !answer) {
    return res
      .status(400)
      .json({ Alert: "Question ID and Answer are required!" });
  }

  try {
    const question = await forumModel.findById(questionId);

    if (!question) {
      return res.status(404).json({ Alert: "Question not found!" });
    }

    const answerObj = {
      text: answer,
      answeredBy: answeredBy,
    };

    question.answers.push(answerObj);
    await question.save();

    res.status(200).json({ Alert: "Answer added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Alert: "Internal Server Error" });
  }
});

router.route("/search").post(async (req, res) => {
  const { search } = req?.body;
  try {
    const regex = new RegExp(search, "i"); // 'i' flag for case-insensitive search
    const matches = await forumModel.find({ question: regex });

    if (matches) {
      res.status(200).json(matches);
    } else {
      res.status(404).json({ Alert: "No results found!" });
    }
  } catch (err) {
    console.error(err);
  }
});

router.route("/delans").post(async (req, res) => {
  try {
    const { questionID, answerID } = req.body;

    console.log(questionID, answerID);

    if (!questionID || !answerID) {
      return res.status(400).json({ Alert: "No ID or Who Answered Provided!" });
    }

    const forumQuestion = await forumModel.findById(questionID);

    if (!forumQuestion) {
      return res.status(404).json({ Alert: "Invalid Question ID" });
    }

    for (let i = 0; i < forumQuestion.answers.length; i++) {
      if (forumQuestion.answers[i]._id == answerID) {
        forumQuestion.answers.splice(i, 1);
        await forumQuestion.save();
        return res.status(200).json({ Alert: "Answer Deleted!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Alert: "Internal Server Error" });
  }
});

router
  .route("/:id")
  .put(async (req, res) => {
    const { answer, whoAnswered } = req.body; //by default the guest answers
    const id = req.params.id;

    if (!answer || !id) {
      return res.status(400).json({ Alert: "No Answer or ID Provided!" });
    }

    try {
      const exists = await forumModel.findById(id);
      if (!exists) {
        return res.status(404).json({ Alert: "Invalid ID" });
      }

      exists.answers.push({ text: answer, answeredBy: whoAnswered });
      await exists.save();

      return res.status(200).json({ Alert: `Updated ${id}` });
    } catch (error) {
      console.error("Error updating answer:", error);
      return res.status(500).json({ Alert: "Internal Server Error" });
    }
  })
  .delete(async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
      return res.status(400).json({ Alert: "No ID Provided!" });
    }

    try {
      const exists = await forumModel.findById(id);

      if (!exists) {
        return res.status(404).json({ Alert: "Invalid ID" });
      }

      await exists.deleteOne();
      return res.status(200).json({ Alert: `Deleted ${id}` });
    } catch (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ Alert: "Internal Server Error" });
    }
  });

router.route("/upvotes").post(async (req, res) => {
  const { questionID } = req?.body;

  if (!questionID)
    return res.status(400).json({ Alert: "ID + userID are REQUIRED!" });
  try {
    const exists = await forumModel.findById(questionID);
    if (!exists) {
      return res
        .status(404)
        .json({ Alert: `${String(questionID)} is invalid!` });
    } else {
      exists.rating += 1;
      const answeredBy = exists.by;

      const user = await userModel.findOne({ username: answeredBy });

      if (!user) {
        return res.status(404).json({ Alert: "Invalid User!" });
      }

      user.voxelPoints += 5;

      await user.save().then(async () => {
        await exists.save().then(() => {
          return res.status(200).json({ Alert: "Nerd Points Updated!" });
        });
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ Alert: "Internal Server Error" });
  }
});

router.route("/downvotes").post(async (req, res) => {
  const { questionID } = req?.body;

  if (!questionID)
    return res.status(400).json({ Alert: "ID + userID are REQUIRED!" });
  try {
    const exists = await forumModel.findById(questionID);
    if (!exists) {
      return res
        .status(404)
        .json({ Alert: `${String(questionID)} is invalid!` });
    } else {
      exists.rating -= 1;
      const answeredBy = exists.by;

      const user = await userModel.findOne({ username: answeredBy });

      if (!user) {
        return res.status(404).json({ Alert: "Invalid User!" });
      }

      user.voxelPoints -= 5;

      await user.save().then(async () => {
        await exists.save().then(() => {
          return res.status(200).json({ Alert: "Nerd Points Updated!" });
        });
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ Alert: "Internal Server Error" });
  }
});

router.route("/upvoteAnswer").post(async (req, res) => {
  const { questionID, answerID } = req?.body;

  if (!questionID || !answerID)
    return res.status(400).json({ Alert: "ID + userID are REQUIRED!" });
  try {
    const exists = await forumModel.findById(questionID);
    if (!exists) {
      return res
        .status(404)
        .json({ Alert: `${String(questionID)} is invalid!` });
    } else {
      for (let i = 0; i < exists.answers.length; i++) {
        if (exists.answers[i]._id == answerID) {
          exists.answers[i].noOfUpvotes += 1;
          const answeredBy = exists.answers[i].answeredBy;
          const user = await userModel.findOne({ username: answeredBy });
          if (!user) {
            return res.status(404).json({ Alert: "Invalid User!" });
          }
          user.voxelPoints += 5;

          await user.save().then(async () => {
            await exists.save().then(() => {
              return res.status(200).json({
                Alert: "Nerd Points Updated!",
              });
            });
          });
        }
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ Alert: "Internal Server Error" });
  }
});

router.route("/downvoteAnswer").post(async (req, res) => {
  const { questionID, answerID } = req?.body;

  if (!questionID || !answerID)
    return res.status(400).json({ Alert: "ID + userID are REQUIRED!" });
  try {
    const exists = await forumModel.findById(questionID);
    if (!exists) {
      return res
        .status(404)
        .json({ Alert: `${String(questionID)} is invalid!` });
    } else {
      for (let i = 0; i < exists.answers.length; i++) {
        if (exists.answers[i]._id == answerID) {
          exists.answers[i].noOfUpvotes -= 1;
          const answeredBy = exists.answers[i].answeredBy;
          const user = await userModel.findOne({ username: answeredBy });
          if (!user) {
            return res.status(404).json({ Alert: "Invalid User!" });
          }
          user.voxelPoints -= 5;

          await user.save().then(async () => {
            await exists.save().then(() => {
              return res.status(200).json({
                Alert: "Nerd Points Updated!",
              });
            });
          });
        }
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ Alert: "Internal Server Error" });
  }
});

module.exports = router;
