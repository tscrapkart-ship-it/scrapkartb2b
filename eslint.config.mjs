import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Old prototype + scratch folder — kept locally for reference, not part of the app
    "scrapkart-connect-3bff3333-main/**",
    "random folder/**",
    // Generated PWA service-worker bundles (next-pwa output, regenerated each build)
    "public/sw.js",
    "public/workbox-*.js",
    "public/swe-worker-*.js",
    // Build-time Node scripts (CommonJS require() is the right call here — they're
    // executed by node directly, not bundled). The TS-flavored rules don't apply.
    "scripts/**/*.cjs",
  ]),
]);

export default eslintConfig;
