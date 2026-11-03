import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/base/badge";

describe("Badge Component", () => {
    it("renders badge with children text correctly", () => {
        render(<Badge>Cybersecurity</Badge>);
        const badgeElement = screen.getByText("Cybersecurity");
        expect(badgeElement).toBeInTheDocument();
    });

    it("applies destructive variant class correctly", () => {
        render(<Badge variant="destructive">High Risk</Badge>);
        const badgeElement = screen.getByText("High Risk");
        expect(badgeElement).toHaveClass("bg-destructive");
    });

    it("applies secondary variant class correctly", () => {
        render(<Badge variant="secondary">Security Analyst</Badge>);
        const badgeElement = screen.getByText("Security Analyst");
        expect(badgeElement).toHaveClass("bg-secondary");
    });
});

