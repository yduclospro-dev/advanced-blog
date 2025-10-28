import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jsdom",
        testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    collectCoverageFrom: [
            "src/**/*.{js,jsx,ts,tsx}",
            "tests/**/*.{js,jsx,ts,tsx}",
            "!src/**/*.d.ts",
            "!tests/**/*.d.ts",
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};

export default createJestConfig(customJestConfig);
