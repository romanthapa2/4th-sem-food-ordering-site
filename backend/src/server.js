import http from "http";
import "dotenv/config";
import { handleRoutes } from "./routes.js";

const PORT = 3000;

const server = http.createServer((req, res) => {
  handleRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
