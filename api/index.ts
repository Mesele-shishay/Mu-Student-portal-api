// Vercel Serverless Adapter for Express.js
// This file handles the serverless function entry point

// Register path aliases
require("../vercel-build");

import app from "../src/index";

// Export the Express app as the default handler for Vercel
export default app;
