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
    // Android/iOS 빌드 파일
    "android/**",
    "ios/**",
    // PWA 파일
    "public/sw.js",
  ]),
  // 커스텀 규칙
  {
    rules: {
      // useEffect 내 setState는 초기화 패턴에서 필요 (클라이언트 사이드 초기화)
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
