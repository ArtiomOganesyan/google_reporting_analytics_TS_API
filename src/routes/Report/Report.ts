import express, { Request, Response } from "express";
import { reportController } from "../../controllers";
import { auth } from "../../middleware/auth";

export const router = express.Router({
  strict: true,
});

router.post("/", auth, (req: Request, res: Response) => {
  reportController.read(req, res);
});
