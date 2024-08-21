import React from "react";
import { create } from "zustand";

import { KeymapActions, KeymapState, Keymap, KeymapOptions } from "./types";

type Store = KeymapState & KeymapActions;

export const useKeyHandler = create<Store>((set, get) => ({
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
    set: (value: Keymap) => {
        let val = get().value;
        if (val.length <= 1) {
            set({ value: [{ map: value, options: { transparent: false } }] });
        }
    },
}));

const empty = {};
export const useKeymap = (
    def: Keymap,
    deps: any[],
    // TODO: allow more options, like defining on which elements to listen to
    options: KeymapOptions = {
        transparent: true,
    }
) => {
    let push = useKeyHandler(({ push }) => push);
    let pop = useKeyHandler(({ pop }) => pop);
    React.useEffect(() => {
        push(def, options);
        return () => {
            pop(def);
        };
    }, deps);
};
