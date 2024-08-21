import { createStore } from "zustand";

import {
    KeymapActions,
    KeymapState,
    Keymap,
    KeymapOptions,
    Extended,
} from "./types";

export type Store = KeymapState & KeymapActions;

export function expandModifiers(map: Keymap) {
    let newMap = { ...map };
    if (map.Shift) {
        newMap.ShiftLeft = map.Shift;
        newMap.ShiftRight = map.Shift;
    }
    if (map.Shift_up) {
        newMap.ShiftLeft_up = map.Shift_up;
        newMap.ShiftRight_up = map.Shift_up;
    }
    if (map.Ctrl) {
        newMap.CtrlLeft = map.Ctrl;
        newMap.CtrlRight = map.Ctrl;
    }
    if (map.Ctrl_up) {
        newMap.CtrlLeft_up = map.Ctrl_up;
        newMap.CtrlRight_up = map.Ctrl_up;
    }
    if (map.Alt) {
        newMap.AltLeft = map.Alt;
        newMap.AltRight = map.Alt;
        newMap.AltGraph = map.Alt;
    }
    if (map.Alt_up) {
        newMap.AltLeft_up = map.Alt_up;
        newMap.AltRight_up = map.Alt_up;
        newMap.AltGraph_up = map.Alt_up;
    }
    return newMap;
}

export function isInputEvent(e: any) {
    if (
        e.target &&
        e.target.tagName &&
        (["TEXTAREA", "INPUT"].includes(e.target.tagName) ||
            e.target.isContentEditable) &&
        !e.target.classList.contains("keyThrough")
    ) {
        if (
            (e.ctrlKey && e.code === "Enter") ||
            e.code === "NumpadEnter" ||
            (e.key === "Enter" && e.target.tagName === "INPUT") ||
            e.code === "Escape"
        )
            return false;
        return true;
    }
    return false;
}

export const applyKeymap = (
    e: Extended<KeyboardEvent>,
    keymap: Keymap,
    suffix = ""
) => {
    let key = e.code || e.key;
    if (e.spaceKey && key !== "Space") key = "Space_" + key;
    if (e.shiftKey && e.key !== "Shift") key = "Shift_" + key;
    if (e.altKey && e.key !== "Alt") key = "Alt_" + key;
    if (e.ctrlKey && e.key !== "Ctrl") key = "Ctrl_" + key;
    key += suffix;
    let handler = keymap[key];
    if (handler) {
        e.preventDefault();
        return handler(e as any);
    } else if (e.key.length === 1 && keymap.AnyCharacter) {
        e.preventDefault();
        return keymap.AnyCharacter(e as any);
    }
};

export const createKeymapStore = () => {
    return createStore<Store>()((set, get) => ({
        value: [],
        push: (map: Keymap, options: KeymapOptions) => {
            let value = get().value;
            if (map !== value[value.length - 1]?.map) {
                set({
                    value: [...value, { map, options }],
                });
            }
        },
        pop: (map: Keymap) => {
            let value = get().value;
            if (map === value[value.length - 1]?.map) {
                set({ value: value.slice(0, -1) });
            }
        },
        set: (map: Keymap) => {
            let val = get().value;
            if (val.length <= 1) {
                set({ value: [{ map, options: { transparent: false } }] });
            }
        },
    }));
};
