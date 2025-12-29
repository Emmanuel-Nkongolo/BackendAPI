import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "hi there from the router and movieRouter.js file" });
});

export default router;
