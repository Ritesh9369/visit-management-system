import express from "express";
import {
  registerVisitor,
  getVisitors
} from "../controllers/visitorController.js";

const router = express.Router();

router.post("/register", registerVisitor);
router.get("/all", getVisitors);

export default router;
