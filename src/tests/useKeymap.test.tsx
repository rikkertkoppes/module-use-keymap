/**
 * @jest-environment jsdom
 */

import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useKeymap, KeyHandler } from "..";

function TestApp() {
    return (
        <div>
            <KeyHandler />
            <TestComponent />
        </div>
    );
}
function TestComponent() {
    let [count, setCount] = React.useState(0);
    let inc = () => {
        setCount(count + 1);
    };
    let dec = () => {
        setCount(count - 1);
    };
    useKeymap(
        {
            ArrowUp: inc,
            ArrowDown_up: dec,
            KeyA: inc,
            Ctrl_KeyA: dec,
            Shift: dec,
        },
        []
    );
    return <div data-testid="testcomponent">{count}</div>;
}

describe("useInner", () => {
    test("sanity check for test component", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        expect(div.textContent).toBe("0");
    });
    test("ArrowUp event on keydown", () => {
        let { getByTestId, rerender } = render(<TestApp />);
        rerender(<TestApp />);
        let div = getByTestId("testcomponent");
        userEvent.keyboard("[ArrowUp]");
        expect(div.textContent).toBe("1");
    });
    test("ArrowDown event on keyup", () => {
        let { getByTestId, rerender } = render(<TestApp />);
        rerender(<TestApp />);
        let div = getByTestId("testcomponent");
        userEvent.keyboard("[ArrowDown]");
        expect(div.textContent).toBe("-1");
    });
    test("KeyA event", () => {
        let { getByTestId, rerender } = render(<TestApp />);
        rerender(<TestApp />);
        let div = getByTestId("testcomponent");
        userEvent.keyboard("[KeyA]");
        expect(div.textContent).toBe("1");
    });
    test("Ctrl KeyA event", () => {
        let { getByTestId, rerender } = render(<TestApp />);
        rerender(<TestApp />);
        let div = getByTestId("testcomponent");
        userEvent.keyboard("[ControlLeft>][KeyA][/ControlLeft]");
        expect(div.textContent).toBe("-1");
    });
    test("Just the shift key", () => {
        let { getByTestId, rerender } = render(<TestApp />);
        rerender(<TestApp />);
        let div = getByTestId("testcomponent");
        userEvent.keyboard("[ShiftLeft]");
        expect(div.textContent).toBe("-1");
    });
});
