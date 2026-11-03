/* We cannot use type `unknown` instead of `any` here because it will break the type assertion `isReactComponent` function is providing. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { extendTailwindMerge } from "tailwind-merge";

type ReactComponent = React.FC<any> | React.ComponentClass<any, any>;

/**
 * Checks if a given value is a function component.
 */
export const isFunctionComponent = (component: any): component is React.FC<any> => {
    return typeof component === "function";
};

/**
 * Checks if a given value is a class component.
 */
export const isClassComponent = (component: any): component is React.ComponentClass<any, any> => {
    return typeof component === "function" && component.prototype && (!!component.prototype.isReactComponent || !!component.prototype.render);
};

/**
 * Checks if a given value is a forward ref component.
 */
export const isForwardRefComponent = (component: any): component is React.ForwardRefExoticComponent<any> => {
    return typeof component === "object" && component !== null && component.$$typeof.toString() === "Symbol(react.forward_ref)";
};

/**
 * Checks if a given value is a valid React component.
 */
export const isReactComponent = (component: any): component is ReactComponent => {
    return isFunctionComponent(component) || isForwardRefComponent(component) || isClassComponent(component);
};


/**
 * Merges Tailwind CSS classes using tailwind-merge.
 */
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            text: ["display-xs", "display-sm", "display-md", "display-lg", "display-xl", "display-2xl"],
        },
    },
});

/**
 * This function is a wrapper around the twMerge function.
 * It is used to merge the classes inside style objects.
 */
export const cx = twMerge;

export function cn(...inputs: any[]): string {
    const classes: string[] = [];
    for (const input of inputs) {
        if (!input) continue;
        if (typeof input === 'string') {
            classes.push(input);
        } else if (typeof input === 'object') {
            for (const key in input) {
                if (input[key]) {
                    classes.push(key);
                }
            }
        }
    }
    return twMerge(classes.join(' '));
}

/**
 * This function does nothing besides helping us to be able to
 * sort the classes inside style objects which is not supported
 * by the Tailwind IntelliSense by default.
 */
export function sortCx<T extends Record<string, string | number | Record<string, string | number | Record<string, string | number>>>>(classes: T): T {
    return classes;
}