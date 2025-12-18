import http from "http";
import "dotenv/config";
import { handleRoutes } from "./routes.js";

const PORT = 3000;
const ALLOWED_ORIGIN = "http://localhost:5173";

/**
 * Set common CORS headers on every response
 */
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );
  // If you don't use cookies/auth headers, you can remove this line
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

const server = http.createServer((req, res) => {
  // Always attach CORS headers
  setCorsHeaders(res);

  // Handle CORS preflight requests early
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  handleRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
