import React from "react";
import { useStore } from "zustand";

import { Store, applyKeymap, createKeymapStore, isInputEvent } from "./store";
import useGlobalHandler from "./useGlobalHandler";

const KeymapContext = React.createContext<ReturnType<typeof createKeymapStore>>(
    null as any
);

function useKeymapStore() {
    const store = React.useContext(KeymapContext);
    if (!store) {
        throw new Error("useKeymap must be used within a KeyProvider");
    }
    return store;
}
export function useKeyHandler<R>(selector: (state: Store) => R): R {
    let store = useKeymapStore();
    return useStore(store, selector);
}

interface KeyCaptureProps extends React.HTMLAttributes<HTMLDivElement> {
    local?: boolean;
}
function KeyCapture({ style, children, local, ...props }: KeyCaptureProps) {
    let values = useKeyHandler((store) => store.value);
    let options = useKeyHandler((store) => store.options);
    // collapse the keymap, if not transparent, only the last, otherwise, merge with previous on the stack
    let keymap = React.useMemo(
        () =>
            values.reduce((map, value) => {
                if (!value.options?.transparent) return value.map;
                return { ...map, ...value.map };
            }, {}),
        [values]
    );
    let handleDown = (e: React.KeyboardEvent) => {
        if (options.debug) {
            console.log("[use-keymap] handle key down", e.nativeEvent, keymap);
        }
        if (!isInputEvent(e.nativeEvent)) {
            return applyKeymap(e.nativeEvent, keymap, options);
        }
    };
    let handleUp = (e: React.KeyboardEvent) => {
        if (options.debug) {
            console.log("[use-keymap] handle key up", e.nativeEvent, keymap);
        }
        if (!isInputEvent(e.nativeEvent)) {
            return applyKeymap(e.nativeEvent, keymap, options, "_up");
        }
    };

    useGlobalHandler(
        "keydown",
        (e: KeyboardEvent) => {
            if (options.debug) {
                console.log("[use-keymap] handle key down", e, keymap);
            }
            if (!isInputEvent(e)) {
                return applyKeymap(e, keymap, options);
            }
        },
        !local
    );
    useGlobalHandler(
        "keyup",
        (e: KeyboardEvent) => {
            if (options.debug) {
                console.log("[use-keymap] handle key up", e, keymap);
            }
            if (!isInputEvent(e)) {
                return applyKeymap(e, keymap, options, "_up");
            }
        },
        !local
    );

    return (
        <div
            onKeyDown={local ? handleDown : undefined}
            onKeyUp={local ? handleUp : undefined}
            tabIndex={0}
            style={{ display: "contents", ...style }}
            {...props}
        >
            {children}
        </div>
    );
}

interface KeyProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    debug?: boolean;
    preventDefault?: boolean;
    local?: boolean;
}
export function KeyProvider({
    children,
    debug,
    preventDefault,
    ...props
}: KeyProviderProps) {
    let storeRef = React.useRef<ReturnType<typeof createKeymapStore>>();
    if (!storeRef.current) {
        storeRef.current = createKeymapStore({ debug, preventDefault });
    }
    return (
        <KeymapContext.Provider value={storeRef.current}>
            <KeyCapture {...props}>{children}</KeyCapture>
        </KeymapContext.Provider>
    );
}
