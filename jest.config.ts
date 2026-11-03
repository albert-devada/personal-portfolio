import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.ts and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    roots: ["<rootDir>/src"],
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        // Handle module aliases
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

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
