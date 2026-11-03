import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

/** @type {import('jest').Config} */
const config = {
    roots: ["<rootDir>/src"],
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^lenis/react$": "<rootDir>/__mocks__/lenis-react.tsx",
        "^lenis$": "<rootDir>/__mocks__/lenis.ts",
        "^@marsidev/react-turnstile$": "<rootDir>/__mocks__/react-turnstile.tsx",
        "^@shadcn/react/(.*)$": "<rootDir>/__mocks__/shadcn-message-scroller.tsx",
        "^@shadcn/react$": "<rootDir>/__mocks__/shadcn-message-scroller.tsx",
    },
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/",
        "<rootDir>/e2e/",
    ],
};

export default createJestConfig(config);

