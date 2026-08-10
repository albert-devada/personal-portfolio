import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TabJsonFormatter from "../tabJsonFormatter";
import { LanguageProvider } from "@/language/languageProvider";

describe("TabJsonFormatter Component", () => {
    const renderComponent = () => {
        return render(
            <LanguageProvider>
                <TabJsonFormatter />
            </LanguageProvider>
        );
    };

    it("renders JSON Formatter & Validator title", () => {
        renderComponent();
        expect(
            screen.getByText(/Format & Validasi JSON|JSON Formatter & Validator/i)
        ).toBeInTheDocument();
    });

    it("formats raw JSON string into prettified JSON with 2-space indentation", () => {
        renderComponent();
        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        const rawJson = '{"name":"Albert","status":"Active"}';
        fireEvent.change(inputArea, { target: { value: rawJson } });

        const expectedPrettified = JSON.stringify(
            { name: "Albert", status: "Active" },
            null,
            2
        );
        expect(outputArea).toHaveValue(expectedPrettified);
    });

    it("minifies valid JSON string when Minify mode is selected", () => {
        renderComponent();
        const minifyBtn = screen.getByRole("button", { name: /Minify/i });
        fireEvent.click(minifyBtn);

        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        const prettifiedJson = `{\n  "key": "value"\n}`;
        fireEvent.change(inputArea, { target: { value: prettifiedJson } });

        expect(outputArea).toHaveValue('{"key":"value"}');
    });

    it("displays error state when input JSON is invalid", () => {
        renderComponent();
        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: '{"broken": ' } });

        expect((outputArea as HTMLTextAreaElement).value).toMatch(/Syntax Error/i);
    });

    it("clears input and output when Clear button is clicked", () => {
        renderComponent();
        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: '{"test": 123}' } });
        expect(outputArea).not.toHaveValue("");

        const clearBtn = screen.getByTitle("Clear");
        fireEvent.click(clearBtn);

        expect(inputArea).toHaveValue("");
        expect(outputArea).toHaveValue("");
    });
});
