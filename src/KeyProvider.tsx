import React from "react";
import { useStore } from "zustand";

import { Store, applyKeymap, createKeymapStore, isInputEvent } from "./store";

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

interface KeyCaptureProps extends React.HTMLAttributes<HTMLDivElement> {}
function KeyCapture({ style, children, ...props }: KeyCaptureProps) {
    let value = useKeyHandler((store) => store.value);
    // collapse the keymap, if not transparent, only the last, otherwise, merge with previous on the stack
    let keymap = React.useMemo(
        () =>
            value.reduce((map, value) => {
                if (!value.options.transparent) return value.map;
                return { ...map, ...value.map };
            }, {}),
        [value]
    );
    let handleDown = (e: React.KeyboardEvent) => {
        if (!isInputEvent(e.nativeEvent)) {
            return applyKeymap(e.nativeEvent, keymap);
        }
    };
    let handleUp = (e: React.KeyboardEvent) => {
        if (!isInputEvent(e.nativeEvent)) {
            return applyKeymap(e.nativeEvent, keymap, "_up");
        }
    };
    return (
        <div
            onKeyDown={handleDown}
            onKeyUp={handleUp}
            tabIndex={0}
            style={{ display: "contents", ...style }}
            {...props}
        >
            {children}
        </div>
    );
}

interface KeyProviderProps extends React.HTMLAttributes<HTMLDivElement> {}
export function KeyProvider({ children, ...props }: KeyProviderProps) {
    let storeRef = React.useRef<ReturnType<typeof createKeymapStore>>();
    if (!storeRef.current) {
        storeRef.current = createKeymapStore();
    }
    return (
        <KeymapContext.Provider value={storeRef.current}>
            <KeyCapture {...props}>{children}</KeyCapture>
        </KeymapContext.Provider>
    );
}
