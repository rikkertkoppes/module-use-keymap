# use-keymap

# usage

use `useKeymap` respond to key events in your application

```
npm install @rkmodules/use-keymap
```

```typescript
import { useKeymap, KeyProvider } from "@rkmodules/use-keymap";
```

## The provider

include the KeyProvider component somewhere on your application, probably somewhere near the root. This component registers key event listeners (and removes them when it is unmounted)

you can use the following props on this provider:

-   `debug` whether to enable debugging, which logs a message on every key down and up event captured by the `KeyProvider`.
-   `preventDefault` can have the following values:
    -   false: does not automatically prevent default behaviour on registered keys
    -   true: always prevents default behaviour on registered keys
    -   undefined: prevents default behaviour on specific keys, but not for the `AnyCharacter` catch all handler (see below)
-   `local` defines whether to register eventhandlers on a local element. Note that for this to work, you need to have a focused descendant element

```tsx
function App() {
    return (
        <KeyProvider>
            <MyComponent />
        </KeyProvide>
    );
}
```

## The hook

After adding the provider, use the `useKeymap` hook in your component. Supply an array of dependencies for the keymap to tell the hook when to update (this is used in a useEffect call). They supplied map is mounted and unmounted with the component, as well as when dependencies change.

The last argument to `useKeymap` defines whether the keymap is "transparent". If set to true, any key not matched by the keymap is checked against the previous keymap.

This allows mounting of a component to overwrite part of an existing map and release it when unmounted. The map could also be dependent on, say, a hover state of the component.

```tsx
function MyComponent() {
    let [count, setCount] = React.useState(0);
    let inc = () => setCount(count + 1);
    let dec = () => setCount(count - 1);
    useKeymap(
        {
            ArrowUp: inc,
            ArrowDown: dec,
            KeyA: inc,
            Ctrl_KeyA: dec,
        },
        [],
        {
            transparent: false,
        }
    );
    return <div>{count}</div>;
}
```

# examples

-   use the `_up` suffix to register on keyup events: `KeyA_up` vs `KeyA`
-   use `Space_`, `Shift_`, `Alt_`, `Ctrl_` prefixes (in that order): `Ctrl_KeyA`, `Alt_Ctrl_keyA` etc
-   use `AnyCharacter` to capture any character, which does not prevent default behaviour by default, you can set the `preventDefault` flag on the `KeyProvider` to enable this

# project setup

followed https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html for project setup

```

```

# publishing

update version in package.json

`git push origin master`
`npm publish --access public`
