import { handleUserRoutes } from './routes/user.route.js';
import { handleProductRoutes } from './routes/product.route.js';
import { handleCheckoutRoutes } from './routes/checkout.route.js';

export function handleRoutes(req, res) {
  const { method, url } = req;

  // Health check routes
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Node backend alive" }));
    return;
  }

  if (method === "GET" && url === "/health") {
    res.writeHead(200);
    res.end("OK");
    return;
  }

  // User routes
  const userRouteHandled = handleUserRoutes(req, res);
  if (userRouteHandled) {
    return;
  }

  // Product routes
  const productRouteHandled = handleProductRoutes(req, res);
  if (productRouteHandled) {
    return;
  }

  // Checkout routes
  const checkoutRouteHandled = handleCheckoutRoutes(req, res);
  if (checkoutRouteHandled) {
    return;
  }

  // Route not found
  res.writeHead(404);
  res.end("Route not found");
}
