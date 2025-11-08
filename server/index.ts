// Custom Next.js server with Socket.io integration
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocket } from "./socket";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare Next.js app and start server
app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.io with the HTTP server
  initializeSocket(httpServer);

  // Start the server
  httpServer.listen(port, () => {
    console.log(`> Next.js ready on http://${hostname}:${port}`);
    console.log(`> Socket.io ready on http://${hostname}:${port}/api/socket`);
  });
});
