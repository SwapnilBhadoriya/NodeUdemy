const User = require("../src/models/user");
const request = require("supertest");
const app = require("../src/app");
const { userOne, userOneId, setUpDatabase } = require("../tests/fixtures/db");

beforeEach(async () => {
  await setUpDatabase();
});
test("Should signup a new user ", async () => {
  await request(app)
    .post("/users")
    .send({ name: "Swapnil", email: "s@s.com", password: "swap123", age: 22 })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "j@j.com", password: "john123" })
    .expect(200);
});

test("Should not login non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "s@j.com", password: "john123" })
    .expect(400);
});

test("Should get profile for the authenticated user ", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for the unauthenticated user ", async () => {
  await request(app).get("/users/me").send().expect(401);
});
test("Should not delete account for the unauthenticated user ", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
test("Should delete account for the authenticated user ", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/weather.png")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields ", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Binny", age: 22 })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Binny");
});
