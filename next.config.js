/** @type {import('next').NextConfig} */

const intercept = require("intercept-stdout")

// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return ""
  }
  return text
}

if (process.env.NODE_ENV === "development") {
  intercept(interceptStdout)
}

const nextConfig = {
  reactStrictMode: true,
  env: {
// @see https://github.com/facebookexperimental/Recoil/issues/2135#issuecomment-1362197710
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: "false",
  }
};

module.exports = nextConfig;