import React from "react";

export const useGlobalHandler = <K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any
) => {
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        window.document.addEventListener(type, listener);
        return () => {
            window.document.removeEventListener(type, listener);
        };
    }, [type, listener]);
};

export default useGlobalHandler;
