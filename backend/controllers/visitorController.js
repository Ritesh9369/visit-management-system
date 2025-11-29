import Visitor from "../models/Visitor.js";

export const registerVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json({ success: true, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
