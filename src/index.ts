import express from "express";
import { PORT } from "./config/constants";
import { reportRouter } from "./routes";

const app = express();

app.use(express.json());

app.use("/api/v1/analytics", reportRouter);

app.listen(PORT, () => console.log(`Server is up on port: ${PORT}`));
