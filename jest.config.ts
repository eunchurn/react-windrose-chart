import { GlobalConfigTsJest } from "ts-jest";
import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const globals: GlobalConfigTsJest = {
  "ts-jest": {
    tsconfig: "tsconfig.json",
    compiler: "typescript",
  },
};

const jestSetting: InitialOptionsTsJest = {
  setupFiles: ["<rootDir>/.jest/setupEnv.ts"],
  globals,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: ".",
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  modulePathIgnorePatterns: ["dist"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/transformers/fileTransformer.js",
    "\\.(css|less)$": "<rootDir>/transformers/styleTransformer.js",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
    "/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)",
  ],
  // collectCoverageFrom: [
  //   "(src|packages)/**/*.ts",
  //   "!**/(index|*.stories|stories).ts",
  //   "!**/dist/**/*",
  //   "!packages/react-cache/**/*",
  // ],
};

export default jestSetting;
