import React from "react";

import { Keymap, KeymapOptions } from "./types";
import { expandModifiers } from "./store";
import { useKeyHandler } from "./KeyProvider";

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
    let expanded = React.useMemo(() => expandModifiers(def), [def]);
    React.useEffect(() => {
        push(expanded, options);
        return () => {
            pop(expanded);
        };
    }, deps);
};
