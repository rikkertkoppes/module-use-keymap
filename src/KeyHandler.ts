import { Extended, Keymap } from "./types";
import { useGlobalHandler, useKeyHandler } from ".";

function isInputEvent(e: any) {
    if (
        e.target &&
        e.target.tagName &&
        ["TEXTAREA", "INPUT"].includes(e.target.tagName) &&
        !e.target.classList.contains("keyThrough")
    ) {
        if (
            (e.ctrlKey && e.code === "Enter") ||
            e.code === "NumpadEnter" ||
            (e.key === "Enter" && e.target.tagName === "INPUT")
        )
            return false;
        return true;
    }
    return false;
}

const applyKeymap = (
    e: Extended<KeyboardEvent>,
    keymap: Keymap,
    suffix = ""
) => {
    let key = e.code || e.key;
    if (e.spaceKey && key !== "Space") key = "Space_" + key;
    if (e.shiftKey && key !== "Shift") key = "Shift_" + key;
    if (e.altKey && key !== "Alt") key = "Alt_" + key;
    if (e.ctrlKey && key !== "Ctrl") key = "Ctrl_" + key;
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

export const KeyHandler = () => {
    let [status] = useKeyHandler();
    let keymap = status.value.reduce((map, value) => {
        if (!value.transparent) return value.map;
        return { ...map, ...value.map };
    }, {});

    useGlobalHandler("keydown", (e: KeyboardEvent) => {
        if (!isInputEvent(e)) {
            return applyKeymap(e, keymap);
        }
    });
    useGlobalHandler("keyup", (e: KeyboardEvent) => {
        if (!isInputEvent(e)) {
            return applyKeymap(e, keymap, "_up");
        }
    });

    // do not render anything
    return null;
};
