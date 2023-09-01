const express = require("express");
const auth = require("../middlewares/auth");
const Task = require("../models/task");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    const result = await task.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    const match = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true" ? true : false;
    }
    const parts = "";
    if (req.query.sortBy) {
      parts = req.query.sortBy.split(":");
    }
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: {
          [parts[0]]: parts[1],
        },
      },
    });

    res.send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const task = await Task.find({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    console.log(task);
    console.log(updates);
    updates.forEach((update) => {
      task[0][update] = req.body[update];
    });
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
