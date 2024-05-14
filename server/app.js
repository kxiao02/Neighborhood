const express = require("express");
const { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const {
  pool,
  getProfile,
  createUser,
  getAddress,
  getUserByEmail,
  createProfile,
  createAddress,
  updateAddress,
  updateProfile,
  queryThreads,
  getThread,
  queryMessages,
  createMessage,
  createThread,
  searchByKeyword,
  searchByLocation,
  queryLocalities,
  queryFriends,
  queryUsers,
  requestFriend,
  rejectFriend,
  approvedFriend,
  queryNeighbors,
  requestNeighbor,
  subscriptionLocality,
  pendingUsers,
  joinLocality,
  approvalRequest,
  newMembers,
  updateThreadAccess,
  getUserById,
  updateMessageAccess,
  updateProfileAccess,
} = require("./db");
const app = express();
const port = 3000;
const secretKey = "ff@@fd-##"; // replace with your own secret key

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.use(cors()); // Use cors middleware

app.use(
  expressjwt({
    secret: secretKey,
    algorithms: ["HS256"],
  }).unless({ path: ["/login", "/reg"] })
);

app.use(express.json()); // for parsing application/json

app.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user) {
            res.status(401).send("Invalid credentials");
            return;
        }

        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            const token = jwt.sign({ id: user.uid, email }, secretKey, {
                expiresIn: "30d",
            });
            res.json({ token, user: { email: user.email } });
        } else {
            res.status(401).send("Invalid credentials");
        }
    })
);


app.get(
  "/me",
  asyncHandler(async (req, res) => {
    const localities = await queryLocalities(req.auth.id);
    const profile = await getProfile(req.auth.id);
    const address = await getAddress(profile.aid);
    res.json({ user: req.auth, localities, address });
  })
);

app.post(
  "/reg",
  asyncHandler(async (req, res) => {
    const { email, password, profile, address } = req.body;

    createUser(email, password)
      .then((uid) => {
        createAddress(address).then((aid) => {
          createProfile(uid, { ...profile, aid }).then(() => {
            res.json({ id: uid, email });
          });
        });
      })
      .catch((err) => {
        if (err.code === "23505") {
          return res.status(400).send({ message: "User already exists" });
        } else {
          next(err);
        }
      });
  })
);

app.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const profile = await getProfile(req.auth.id);
    const address = await getAddress(profile.aid);
    res.json({ profile, address });
  })
);

app.get(
  "/profile/:id",
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.params.id);
    const profile = await getProfile(req.params.id);
    const address = await getAddress(profile.aid);
    await updateProfileAccess(req.auth.id, req.params.id);
    res.json({ email: user.email, profile, address });
  })
);

app.post(
  "/profile",
  asyncHandler(async (req, res) => {
    const { profile, address } = req.body;
    await updateProfile(req.auth.id, profile);
    await updateAddress(profile.aid, address);
    res.json({ success: true });
  })
);

app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json([]);
  })
);

app.post(
  "/threads",
  asyncHandler(async (req, res) => {
    const { type, newMsg } = req.body;
    console.log("type", type, "newMsg", newMsg);
    const all = await queryThreads(req.auth.id, type, newMsg);
    res.json(all);
  })
);

app.post(
  "/search",
  asyncHandler(async (req, res) => {
    const { type, keyword, feet, location } = req.body;
    if (type === "feet") {
      const all = await searchByLocation(location, feet);
      res.json(all);
    } else if (type === "keyword") {
      const all = await searchByKeyword(req.auth.id, keyword);
      res.json(all);
    } else {
      res.json([]);
    }
  })
);

app.get(
  "/thread/:id",
  asyncHandler(async (req, res) => {
    const thread = await getThread(req.params.id);
    const messages = await queryMessages(req.params.id);
    await updateThreadAccess(req.auth.id, req.params.id);
    if (messages.length > 0) {
      await updateMessageAccess(req.auth.id, messages[0].mid);
    }
    res.json({ thread, messages });
  })
);

app.post(
  "/thread",
  asyncHandler(async (req, res) => {
    const { title, body, feed_type, target_lid } = req.body;
    const tid = await createThread({
      uid: req.auth.id,
      title,
      feed_type,
      target_lid,
    });
    const profile = await getProfile(req.auth.id);
    const address = await getAddress(profile.aid);
    await createMessage({
      tid,
      sender_uid: req.auth.id,
      reply_to_mid: null,
      body,
      longitude: address.longitude,
      latitude: address.latitude,
      target_lid,
    });
    res.json({ success: true });
  })
);

app.post(
  "/message",
  asyncHandler(async (req, res) => {
    const { tid, reply_to_mid, body } = req.body;
    const thread = await getThread(tid);
    const profile = await getProfile(req.auth.id);
    const address = await getAddress(profile.aid);
    await createMessage({
      tid,
      sender_uid: req.auth.id,
      reply_to_mid,
      body,
      longitude: address.longitude,
      latitude: address.latitude,
      target_lid: thread.target_lid,
    });
    res.json({ success: true });
  })
);

app.get(
  "/friends",
  asyncHandler(async (req, res) => {
    const friends = await queryFriends(req.auth.id);
    res.json(friends);
  })
);

app.post(
  "/friends",
  asyncHandler(async (req, res) => {
    const { friendId } = req.body;
    await requestFriend(req.auth.id, friendId);
    res.json({ success: true });
  })
);

app.post(
  "/friends/approve",
  asyncHandler(async (req, res) => {
    const { friendId } = req.body;
    await approvedFriend(req.auth.id, friendId);
    res.json({ success: true });
  })
);

app.post(
  "/friends/reject",
  asyncHandler(async (req, res) => {
    const { friendId } = req.body;
    await rejectFriend(req.auth.id, friendId);
    res.json({ success: true });
  })
);

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await queryUsers();
    res.json(users);
  })
);

app.get(
  "/neighbors",
  asyncHandler(async (req, res) => {
    const neighbors = await queryNeighbors(req.auth.id);
    res.json(neighbors);
  })
);

app.post(
  "/neighbors",
  asyncHandler(async (req, res, next) => {
    const { neighborId } = req.body;
    await requestNeighbor(req.auth.id, neighborId)
      .then((result) => {
        res.json({ success: true });
      })
      .catch((err) => {
        if (err.code === "P0001") {
          return res.status(400).send({ message: err.message });
        } else {
          next(err);
        }
      });
  })
);

app.post(
  "/subscription",
  asyncHandler(async (req, res) => {
    const { lid, sub_type } = req.body;
    await subscriptionLocality(req.auth.id, lid, sub_type).then((result) => {
      res.json({ success: true });
    });
  })
);

app.post(
  "/join",
  asyncHandler(async (req, res) => {
    const { lid } = req.body;
    await joinLocality(req.auth.id, lid).then((result) => {
      res.json({ success: true });
    });
  })
);

app.post(
  "/pending",
  asyncHandler(async (req, res) => {
    const { lid } = req.body;
    const pending = await pendingUsers(req.auth.id, lid);
    const members = await newMembers(lid);
    res.json({ pending, members });
  })
);

app.post(
  "/approved",
  asyncHandler(async (req, res) => {
    const { rid, approvad } = req.body;
    await approvalRequest(rid, req.auth.id, approvad);
    res.json({ success: true });
  })
);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token");
  } else {
    res.status(500).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
