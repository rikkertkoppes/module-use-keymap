import React from "react";

export const useGlobalHandler = <K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    enabled: boolean = true
) => {
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        if (!enabled) return;
        window.document.addEventListener(type, listener);
        return () => {
            window.document.removeEventListener(type, listener);
        };
    }, [type, listener, enabled]);
};

export default useGlobalHandler;
