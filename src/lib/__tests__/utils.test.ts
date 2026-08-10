import { cn, formatDate } from "../utils";

describe("utils library", () => {
    describe("cn (classname merge helper)", () => {
        it("should merge class names correctly", () => {
            const result = cn("px-2 py-1", "bg-blue-500", {
                "text-white": true,
                hidden: false,
            });
            expect(result).toBe("px-2 py-1 bg-blue-500 text-white");
        });

        it("should override conflicting tailwind classes", () => {
            const result = cn("p-2", "p-4");
            expect(result).toBe("p-4");
        });
    });

    describe("formatDate", () => {
        it("should format valid date string correctly in UTC", () => {
            const result = formatDate("2026-08-09T00:00:00Z");
            expect(result).toBe("August 9, 2026");
        });
    });
});
