import type { AstNode } from "@/common/types";

const BR_REGEX = /(?:<br\s*\/?>|<br\s*><\/br>|&lt;br\s*\/?&gt;|&lt;br\s*&gt;&lt;\/br&gt;)/i;
const BR_SPLIT_REGEX = /(<br\s*\/?>|<br\s*><\/br>|&lt;br\s*\/?&gt;|&lt;br\s*&gt;&lt;\/br&gt;)/i;
const BR_EXACT_REGEX = /^(?:<br\s*\/?>|<br\s*><\/br>|&lt;br\s*\/?&gt;|&lt;br\s*&gt;&lt;\/br&gt;)$/i;

export function remarkHtmlBreaks() {
    return (tree: AstNode) => {
        function traverse(node: AstNode) {
            if (!node || !Array.isArray(node.children)) return;
            if (node.type === "code" || node.type === "inlineCode") return;

            const newChildren: AstNode[] = [];
            for (const child of node.children) {
                if (child.type === "html" && typeof child.value === "string" && BR_EXACT_REGEX.test(child.value.trim())) {
                    newChildren.push({ type: "break" });
                } else if (child.type === "text" && typeof child.value === "string" && BR_REGEX.test(child.value)) {
                    const parts = child.value.split(BR_SPLIT_REGEX);
                    for (const part of parts) {
                        if (!part) continue;
                        if (BR_EXACT_REGEX.test(part)) {
                            newChildren.push({ type: "break" });
                        } else {
                            newChildren.push({ type: "text", value: part });
                        }
                    }
                } else {
                    newChildren.push(child);
                    traverse(child);
                }
            }
            node.children = newChildren;
        }
        traverse(tree);
    };
}

export function rehypeHtmlBreaks() {
    return (tree: AstNode) => {
        function traverse(node: AstNode) {
            if (!node || !Array.isArray(node.children)) return;
            if (node.tagName === "code" || node.tagName === "pre") return;

            const newChildren: AstNode[] = [];
            for (const child of node.children) {
                if (child.type === "raw" && typeof child.value === "string" && BR_EXACT_REGEX.test(child.value.trim())) {
                    newChildren.push({
                        type: "element",
                        tagName: "br",
                        properties: {},
                        children: [],
                    });
                } else if (child.type === "text" && typeof child.value === "string" && BR_REGEX.test(child.value)) {
                    const parts = child.value.split(BR_SPLIT_REGEX);
                    for (const part of parts) {
                        if (!part) continue;
                        if (BR_EXACT_REGEX.test(part)) {
                            newChildren.push({
                                type: "element",
                                tagName: "br",
                                properties: {},
                                children: [],
                            });
                        } else {
                            newChildren.push({ type: "text", value: part });
                        }
                    }
                } else {
                    newChildren.push(child);
                    traverse(child);
                }
            }
            node.children = newChildren;
        }
        traverse(tree);
    };
}