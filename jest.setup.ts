import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion / motion library in jsdom
global.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor() {}

    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
    unobserve() {}
};

// Mock ResizeObserver for Base UI / Radix / Motion in jsdom
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock matchMedia for responsive/theme hooks in jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock navigator.clipboard for copy button functionality in tests
Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    },
});

// Mock lenis for smooth scroll in tests
jest.mock('lenis/react', () => ({
    ReactLenis: ({ children }: { children?: React.ReactNode }) => children,
    useLenis: () => null,
}));

jest.mock('lenis', () => {
    return jest.fn().mockImplementation(() => ({
        destroy: jest.fn(),
        raf: jest.fn(),
        scrollTo: jest.fn(),
    }));
});

// Mock Cloudflare Turnstile in tests
jest.mock('@marsidev/react-turnstile', () => ({
  Turnstile: () => null,
}));

// Mock @shadcn/react message-scroller in tests
jest.mock('@shadcn/react/message-scroller', () => ({
  MessageScroller: {
    Provider: ({ children }: { children?: React.ReactNode }) => children,
    Root: ({ children }: { children?: React.ReactNode }) => children,
    Viewport: ({ children }: { children?: React.ReactNode }) => children,
    Content: ({ children }: { children?: React.ReactNode }) => children,
    Item: ({ children }: { children?: React.ReactNode }) => children,
    Button: ({ children }: { children?: React.ReactNode }) => children,
  },
  useMessageScroller: () => ({
    scrollToEnd: jest.fn(),
    scrollToMessage: jest.fn(),
    scrollToStart: jest.fn(),
  }),
  useMessageScrollerScrollable: () => ({ start: false, end: false }),
  useMessageScrollerVisibility: () => ({ currentAnchorId: null, visibleMessageIds: [] }),
}));
