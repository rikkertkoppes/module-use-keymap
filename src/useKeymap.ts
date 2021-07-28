import React from "react";
import globalHook, { Store } from "use-global-hook";

import { KeymapActions, KeymapState, Keymap } from "./types";

/** sets non modal keymap, except when there is a stack, in that case, use pop.
 * in general use set to overwrite other set, use push / pop for modal keymap
 */
const setKeymap = (store: Store<KeymapState, KeymapActions>, value: Keymap) => {
    let val = store.state.value;
    if (val.length <= 1) {
        store.setState({ value: [{ map: value, transparent: false }] });
    }
};

/** push modal status, unless it is already the last, use pop to remove from stack */
const pushKeymap = (
    store: Store<KeymapState, KeymapActions>,
    map: Keymap,
    transparent: boolean = true
) => {
    if (map !== store.state.value[store.state.value.length - 1]?.map) {
        store.setState({
            value: [...store.state.value, { map, transparent }],
        });
    }
};

/** pops modal status if the status is the given status */
const popKeymap = (store: Store<KeymapState, KeymapActions>, map: Keymap) => {
    if (map === store.state.value[store.state.value.length - 1]?.map) {
        store.setState({ value: store.state.value.slice(0, -1) });
    }
};

export const useKeyHandler = globalHook<KeymapState, KeymapActions>(
    React,
    { value: [] },
    { push: pushKeymap, pop: popKeymap, set: setKeymap }
);

const empty = {};
export const useKeymap = (
    def: Keymap,
    deps: any[],
    transparent: boolean = true
) => {
    let [keymapState, keymapActions] = useKeyHandler(
        (state) => empty, // only need the action, so return a constant state to not redraw the component on state change
        (actions) => actions
    );
    React.useEffect(() => {
        keymapActions.push(def, transparent);
        return () => {
            keymapActions.pop(def);
        };
    }, deps);
};
