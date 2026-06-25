import os from "node:os";
import path from "node:path";
import ghpages from "gh-pages";

process.env.CACHE_DIR = path.join(os.tmpdir(), "gh-pages-cache");

ghpages.publish(
  "dist",
  {
    branch: "gh-pages",
    nojekyll: true,
    add: false,
    message: "Deploy scanner admin app",
  },
  (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log("Deployed to gh-pages.");
  },
);
