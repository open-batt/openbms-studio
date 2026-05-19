import "@testing-library/jest-dom";

// jsdom's localStorage in this environment is a limited stub — replace it with
// a fully-functional in-memory implementation for tests.
const makeLocalStorageMock = () => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
            store[key] = String(value);
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
    };
};

Object.defineProperty(globalThis, "localStorage", {
    value: makeLocalStorageMock(),
    writable: true,
});
