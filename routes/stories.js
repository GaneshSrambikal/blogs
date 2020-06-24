const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../model/Story");

//desc  ahow add apgae
//route GET /stories/add

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//desc  ahow add apgae
//route post /stories/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    res.render("error/500");
  }
});

//desc  show all apgae
//route GET /

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("/error/500");
  }
});

module.exports = router;
