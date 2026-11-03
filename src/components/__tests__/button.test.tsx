import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/base/button";

describe("Button Component", () => {
    it("renders button with children text correctly", () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByRole("button", { name: /click me/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it("triggers onClick handler when clicked", () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Submit</Button>);
        const buttonElement = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies destructive variant class correctly", () => {
        render(<Button variant="destructive">Delete Action</Button>);
        const buttonElement = screen.getByRole("button", { name: /delete action/i });
        expect(buttonElement).toHaveClass("text-destructive");
    });

    it("handles disabled state properly", () => {
        render(<Button disabled>Disabled Button</Button>);
        const buttonElement = screen.getByRole("button", { name: /disabled button/i });
        expect(buttonElement).toBeDisabled();
    });
});

