/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useKeymap, KeyProvider } from "..";

function TestApp() {
    return (
        <div>
            <KeyProvider data-testid="keyprovider">
                <TestComponent />
            </KeyProvider>
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

function fireKeys(keys: string) {
    screen.getByTestId("keyprovider").focus();
    userEvent.keyboard(keys);
}

describe("useKeymap", () => {
    test("sanity check for test component", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        expect(div.textContent).toBe("0");
    });
    test("ArrowUp event on keydown", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        fireKeys("[ArrowUp]");
        expect(div.textContent).toBe("1");
    });
    test("ArrowDown event on keyup", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        fireKeys("[ArrowDown]");
        expect(div.textContent).toBe("-1");
    });
    test("KeyA event", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        fireKeys("[KeyA]");
        expect(div.textContent).toBe("1");
    });
    test("Ctrl KeyA event", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        fireKeys("[ControlLeft>][KeyA][/ControlLeft]");
        expect(div.textContent).toBe("-1");
    });
    test("Just the shift key", () => {
        let { getByTestId } = render(<TestApp />);
        let div = getByTestId("testcomponent");
        fireKeys("[ShiftLeft]");
        expect(div.textContent).toBe("-1");
    });
});
