export function logRegisteredRoutes(app) {
  if (!app._router || !app._router.stack) {
    console.log("⚠️  No routes found. Make sure routes are set up before logging.");
    return;
  }

  console.log("📦 Registered Routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`➡️  ${middleware.route.path}`);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route && handler.route.path) {
          console.log(`➡️  ${handler.route.path}`);
        } else {
          console.log(`⚙️  Middleware: ${handler.name}`);
        }
      });
    }
  });
}
