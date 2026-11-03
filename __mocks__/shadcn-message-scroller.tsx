import React from "react";

export interface MockComponentProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

const MockComponent = ({ children, ...props }: MockComponentProps) => <div {...props}>{children}</div>;

export const MessageScroller = {
    Provider: MockComponent,
    Root: MockComponent,
    Viewport: MockComponent,
    Content: MockComponent,
    Item: MockComponent,
    Button: MockComponent,
};

export const useMessageScroller = () => ({
    scrollToEnd: jest.fn(),
    scrollToMessage: jest.fn(),
    scrollToStart: jest.fn(),
});

export const useMessageScrollerScrollable = () => ({
    start: false,
    end: false,
});

export const useMessageScrollerVisibility = () => ({
    currentAnchorId: null,
    visibleMessageIds: [],
});

export default MessageScroller;

