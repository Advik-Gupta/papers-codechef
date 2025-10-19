/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  swcMinify: false,
  images: {
    domains: ["res.cloudinary.com", "storage.googleapis.com"],
  },
  webpack: (config, options) => {
    config.resolve.alias.canvas = false;
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
    return config;
  },
};

export default config;
