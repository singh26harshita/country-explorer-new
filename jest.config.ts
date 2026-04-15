import type { Config } from "jest";
import { createCjsPreset } from "jest-preset-angular/presets";

export default {
  ...createCjsPreset(),
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/test.ts"],
} satisfies Config;
