import fs from "fs";
import { config } from "../../config/googleapi";

const readFile = (filepath: string = "") => {
  try {
    let file = fs.readFileSync(filepath, "utf-8");
    return file;
  } catch (error) {
    createConfig(filepath);
    return "{}";
  }
};

export const writeFileCSV = (filepath: string = "", str: string = "") =>
  fs.writeFileSync(filepath, str);

export const readConfigJson = (filepath: string = "") => readFile(filepath);

export const createConfig = (filepath: string = "") =>
  fs.writeFileSync(filepath, JSON.stringify(config));
