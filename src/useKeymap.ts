import React from "react";
import create from "zustand";
import shallow from "zustand/shallow";

import { KeymapActions, KeymapState, Keymap } from "./types";

type Store = KeymapState & KeymapActions;

export const useKeyHandler = create<Store>((set, get) => ({
    value: [],
    push: (map: Keymap, transparent: boolean = true) => {
        let value = get().value;
        if (map !== value[value.length - 1]?.map) {
            set({
                value: [...value, { map, transparent }],
            });
        }
    },
    pop: (map: Keymap) => {
        let value = get().value;
        if (map === value[value.length - 1]?.map) {
            set({ value: value.slice(0, -1) });
        }
    },
    set: (value: Keymap) => {
        let val = get().value;
        if (val.length <= 1) {
            set({ value: [{ map: value, transparent: false }] });
        }
    },
}));

const empty = {};
export const useKeymap = (
    def: Keymap,
    deps: any[],
    transparent: boolean = true
) => {
    let keymapActions = useKeyHandler(
        ({ push, pop }) => ({ push, pop }),
        shallow
    );
    React.useEffect(() => {
        keymapActions.push(def, transparent);
        return () => {
            keymapActions.pop(def);
        };
    }, deps);
};
