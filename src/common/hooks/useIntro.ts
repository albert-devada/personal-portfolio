"use client";

import { useSyncExternalStore } from "react";

let isIntroFinished = false;
const listeners = new Set<() => void>();

export function setIntroFinished(finished = true) {
    if (isIntroFinished !== finished) {
        isIntroFinished = finished;
        listeners.forEach((listener) => listener());
    }
}

export function useIntro() {
    return useSyncExternalStore(
        (callback) => {
            listeners.add(callback);
            return () => {
                listeners.delete(callback);
            };
        },
        () => isIntroFinished,
        () => false
    );
}
