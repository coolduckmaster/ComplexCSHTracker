import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import router from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const asciiArt = `
  _____               __          ___________ __   ______             __          
 / ___/__  __ _  __  / /____ __  / ___/ __/ // /  /_  __/______ _____/ /_____ ____
/ /__/ _ \\/  ' \\/ _\\/ / -_) \\ / / /___\\ \\/ _  /    / / / __/ _ \`/ __/  '_/ -_) __/
\\___/\\___/_/_/_/.__/_/\\__/_\\_\\  \\___/___/_//_/    /_/ /_/  \\_,_/\\__/_/\\_\\\\__/_/   
              /_/
`;

connectDB();

app.use(cors(), express.json());

app.use("/api/user", router);

app.get("/", (req, res) => {
  res.send("API working.");
});

app.listen(PORT, () => {
  console.log(asciiArt);//legit just for the aura. not even usefull :))))
  console.log(`Server running on port ${PORT}`);
});
