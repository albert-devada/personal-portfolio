import { cn, formatDate, CheckRateLimit } from "@/utils";

describe("Utils Library", () => {
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

        it("should handle empty or undefined inputs gracefully", () => {
            const result = cn("px-2", null, undefined, false, "");
            expect(result).toBe("px-2");
        });
    });

    describe("formatDate", () => {
        it("should format valid date string correctly in English", () => {
            const result = formatDate("2026-08-09T12:00:00Z", "en");
            expect(result).toBe("August 9, 2026");
        });

        it("should format valid date string correctly in Indonesian", () => {
            const result = formatDate("2026-08-09T12:00:00Z", "id");
            expect(result).toBe("9 Agustus 2026");
        });

        it("should return empty string for null, undefined, or empty date", () => {
            expect(formatDate(null)).toBe("");
            expect(formatDate(undefined)).toBe("");
            expect(formatDate("")).toBe("");
        });

        it("should fallback to raw string if date is invalid", () => {
            expect(formatDate("invalid-date")).toBe("invalid-date");
        });
    });

    describe("CheckRateLimit", () => {
        it("should allow requests under the limit", () => {
            const result = CheckRateLimit("test-client-ip", 5, 10000);
            expect(result.success).toBe(true);
            expect(result.remaining).toBe(4);
            expect(result.limit).toBe(5);
        });
    });
});

