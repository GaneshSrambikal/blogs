const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../model/Story");

//desc  ahow add apgae
//route GET /stories/add

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

module.exports = router;
