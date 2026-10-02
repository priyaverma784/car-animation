// Static export so the site can be hosted on GitHub Pages.
// The workflow sets NEXT_PUBLIC_BASE_PATH to "/<repo-name>".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};
