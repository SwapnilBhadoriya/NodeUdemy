const User = require("../src/models/user");
const request = require("supertest");
const app = require("../src/app");
const {
  userOne,
  userOneId,
  setUpDatabase,
  userTwo,
  taskOne,
} = require("../tests/fixtures/db");
const Task = require("../src/models/task");

beforeEach(setUpDatabase);

test("Should create task for the user ", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "My demo test for the task" })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should get all tasks for the user one ", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Fail attempt for user trying to delete other user's task", async () => {
  const res = await request(app)
    .delete("/tasks/" + taskOne._id)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
