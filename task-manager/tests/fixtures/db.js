const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "John",
  email: "j@j.com",
  password: "john123",
  age: 12,
  tokens: [{ token: jwt.sign({ _id: userOneId }, "secretkey") }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "John",
  email: "s@b.com",
  password: "john123",
  age: 12,
  tokens: [{ token: jwt.sign({ _id: userTwoId }, "secretkey") }],
};
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing demo task one ",
  owner: userOneId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing demo task two",
  owner: userTwoId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing demo task three",
  owner: userOneId,
};
const setUpDatabase = async function () {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = { userOne, userOneId, userTwo, taskOne, setUpDatabase };
