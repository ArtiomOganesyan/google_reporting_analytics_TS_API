import fs from "fs";
import { config } from "../../config/googleapi";

const readFile = (filepath: string = "") => {
  try {
    let file = fs.readFileSync("./dist/config.json", "utf-8");
    return file;
  } catch (error) {
    createConfig();
    return "{}";
  }
};

export const writeFileCSV = (filepath: string = "", str: string = "") =>
  fs.writeFileSync(filepath, str);

export const readConfigJson = (filepath: string = "") => readFile(filepath);

export const createConfig = (filepath: string = "") =>
  fs.writeFileSync("./dist/config.json", JSON.stringify(config));
