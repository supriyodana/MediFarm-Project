const express = require("express");
const router = express.Router();

const sessionAuth = require("../middleware/sessionAuth");

router.get("/me", sessionAuth, (req, res) => {
  res.json({ user: req.user });

  console.log("This one requested to auth --> " , req.user);
});

router.post("/logout", sessionAuth, (req, res) => {
  req.session.destroy(err => {
    if(err) {
      return res.status(500).json({error: "Logout failed"});

    }
    res.clearCookie(process.env.SESSION_NAME || "connect.sid");
    res.json({ messege: "Logged out"});
  });
});


module.exports = router;