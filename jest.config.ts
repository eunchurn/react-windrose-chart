import { pathsToModuleNameMapper, GlobalConfigTsJest } from "ts-jest";
import type { InitialOptionsTsJest } from "ts-jest/dist/types";
// import ts from "typescript";

// console.log(ts);

// const compilerOptionsPaths = (() => {
//   const configFileName = ts.findConfigFile(
//     "../",
//     ts.sys.fileExists,
//     "tsconfig.json",
//   );
//   console.log(configFileName)
//   if (configFileName) {
//     const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
//     const option = ts.parseJsonConfigFileContent(
//       configFile.config,
//       ts.sys,
//       "./",
//     );
//     return option.raw.compilerOptions.paths;
//   }
//   return {};
// })();

const globals: GlobalConfigTsJest = {
  "ts-jest": {
    tsconfig: "tsconfig.json",
    compiler: "typescript",
  },
};

// const moduleNameMapper = pathsToModuleNameMapper(compilerOptionsPaths, {
//   prefix: "<rootDir>",
// });

const jestSetting: InitialOptionsTsJest = {
  setupFiles: ["<rootDir>/.jest/setupEnv.js"],
  globals,
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  rootDir: ".",
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  // moduleNameMapper,
  modulePathIgnorePatterns: ["dist"],
  testRegex: ".spec|.test.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/transformers/fileTransformer.js",
    // "\\.(css|less)$": "<rootDir>/transformers/styleTransformer.js",
  },
  collectCoverageFrom: [
    "(src|packages)/**/*.ts",
    "!**/(index|*.stories|stories).ts",
    "!**/dist/**/*",
    "!packages/react-cache/**/*",
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"],
};

export default jestSetting;
