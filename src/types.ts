/** building up keys from bits and pieces */
type CtrlMod = "Ctrl_" | "";
type AltMod = "Alt_" | "";
type ShiftMod = "Shift_" | "";
type SpaceMod = "Space_" | "";
type Modifier = `${CtrlMod}${AltMod}${ShiftMod}${SpaceMod}`;

type KeyCode = string;
type Handler = (e: Extended<KeyboardEvent>) => void;

export type Extended<E> = E & {
    spaceKey?: boolean;
    typeOverride?: string;
};

export type Keymap = Partial<Record<KeyCode, Handler>>;
export type KeymapOptions = {
    transparent?: boolean;
};
export type KeymapValue = {
    map: Keymap;
    options: KeymapOptions;
};

export type KeymapState = {
    value: KeymapValue[];
};
export type KeymapActions = {
    push: (map: Keymap, options: KeymapOptions) => void;
    pop: (map: Keymap) => void;
    set: (map: Keymap) => void;
};
