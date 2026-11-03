import React from "react";

export interface MockTurnstileProps {
    [key: string]: unknown;
}

export const Turnstile = React.forwardRef<HTMLDivElement, MockTurnstileProps>(
    function Turnstile(props, ref) {
        return <div data-testid="turnstile-mock" ref={ref} {...props} />;
    }
);

export default Turnstile;