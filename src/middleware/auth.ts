import { Request, Response, NextFunction } from "express";
import { readConfigJson } from "../tools/fs/fs";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.header("private_key_id");
  const email = req.header("client_email");
  const id = req.header("client_id");
  const file = JSON.parse(readConfigJson("./dist/config.json")) || {};

  if (
    key === file.private_key_id &&
    id === file.client_id &&
    email === file.client_email
  ) {
    next();
  } else {
    res.json({
      msg: "error in passed config",
    });
  }
};
