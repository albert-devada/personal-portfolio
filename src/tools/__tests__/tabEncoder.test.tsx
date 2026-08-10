import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TabEncoder from "../tabEncoder";
import { LanguageProvider } from "@/language/languageProvider";

describe("TabEncoder Component", () => {
    const renderComponent = () => {
        return render(
            <LanguageProvider>
                <TabEncoder />
            </LanguageProvider>
        );
    };

    it("renders Encoder / Decoder title and default elements", () => {
        renderComponent();
        expect(screen.getByText(/Encoder \/ Decoder Teks|Text Encoder \/ Decoder/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^Base64$/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^Encode$/i })).toBeInTheDocument();
    });

    it("encodes input text to Base64 automatically", () => {
        renderComponent();
        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: "Hello World" } });

        expect(outputArea).toHaveValue("SGVsbG8gV29ybGQ=");
    });

    it("encodes input text to URL Component when URL mode is active", () => {
        renderComponent();
        const urlModeBtn = screen.getByRole("button", { name: /URL Component/i });
        fireEvent.click(urlModeBtn);

        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: "hello world&foo=bar" } });

        expect(outputArea).toHaveValue("hello%20world%26foo%3Dbar");
    });

    it("decodes Base64 input string correctly", () => {
        renderComponent();
        const decodeBtn = screen.getByRole("button", { name: /^Decode$/i });
        fireEvent.click(decodeBtn);

        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: "SGVsbG8gV29ybGQ=" } });

        expect(outputArea).toHaveValue("Hello World");
    });

    it("clears input and output when Clear button is clicked", () => {
        renderComponent();
        const textareas = screen.getAllByRole("textbox");
        const inputArea = textareas[0];
        const outputArea = textareas[1];

        fireEvent.change(inputArea, { target: { value: "Testing Clear" } });
        expect(outputArea).toHaveValue("VGVzdGluZyBDbGVhcg==");

        const clearBtn = screen.getByTitle("Clear");
        fireEvent.click(clearBtn);

        expect(inputArea).toHaveValue("");
        expect(outputArea).toHaveValue("");
    });
});
