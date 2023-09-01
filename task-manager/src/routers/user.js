const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("multer");

const upload = multer({
  // dest: "avatars/",
  // limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    cb(null, true);
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(null, true);
    }
    cb(new Error("Please upload a valid file "));
  },
});

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ result, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async function (req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
router.post("/users/logoutAll", auth, async function (req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  return res.send(req.user);
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get("/users/me/avatar", auth, async (req, res) => {
  res.set("Content-type", "images/png");
  res.send(req.user.avatar);
});
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.user._id);
    // if (!task) {
    //   return res.status(404).send();
    // }

    await req.user.deleteOne();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
