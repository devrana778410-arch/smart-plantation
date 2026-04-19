const { execSync } = require('child_process');

const secret = process.env.AUTH_SECRET;

if (secret) {
  console.log("Syncing AUTH_SECRET from Vercel to Convex Production...");
  try {
    execSync(`npx convex env set AUTH_SECRET "${secret}"`, { stdio: 'inherit' });
    console.log("Sync complete!");
  } catch (e) {
    console.log("Warning: Failed to set env in Convex (could be due to missing permissions)");
  }
} else {
  console.log("Skipping Convex env sync - no AUTH_SECRET found in build environment.");
}
