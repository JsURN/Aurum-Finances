import { vi } from "vitest";

/*
 * DOM mínimo para testar as preferências em Node: só o que o script inline e o
 * store usam (<html>, a meta theme-color, localStorage, matchMedia e eventos).
 */

type FakeStorageMode = "ok" | "throws-on-access" | "throws-on-write" | "missing";

export type FakeDomOptions = {
  storage?: Record<string, string>;
  storageMode?: FakeStorageMode;
  prefersDark?: boolean;
  matchMediaThrows?: boolean;
};

export function createFakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, String(value)),
  };
}

export function installFakeDom(options: FakeDomOptions = {}) {
  const { storageMode = "ok", matchMediaThrows = false } = options;
  const storage = createFakeStorage(options.storage);

  const classes = new Set<string>();
  const attributes = new Map<string, string>();
  const root = {
    classList: {
      contains: (name: string) => classes.has(name),
      toggle: (name: string, force?: boolean) => {
        const next = force ?? !classes.has(name);
        if (next) classes.add(name);
        else classes.delete(name);
        return next;
      },
    },
    setAttribute: (name: string, value: string) => void attributes.set(name, value),
    getAttribute: (name: string) => attributes.get(name) ?? null,
  };

  const meta = {
    content: "",
    setAttribute(name: string, value: string) {
      if (name === "content") this.content = value;
    },
  };

  let prefersDark = options.prefersDark ?? false;
  const mediaListeners = new Set<() => void>();
  const media = {
    get matches() {
      return prefersDark;
    },
    addEventListener: (_type: "change", listener: () => void) => void mediaListeners.add(listener),
    removeEventListener: (_type: "change", listener: () => void) =>
      void mediaListeners.delete(listener),
  };

  const events = new EventTarget();
  const fakeWindow = {
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    matchMedia: () => {
      if (matchMediaThrows) throw new Error("matchMedia indisponível");
      return media;
    },
    get localStorage() {
      if (storageMode === "missing") return undefined;
      if (storageMode === "throws-on-access") throw new DOMException("bloqueado", "SecurityError");
      if (storageMode === "throws-on-write") {
        return {
          getItem: storage.getItem,
          setItem: () => {
            throw new DOMException("cheio", "QuotaExceededError");
          },
        };
      }
      return storage;
    },
  };

  vi.stubGlobal("window", fakeWindow);
  vi.stubGlobal("document", {
    documentElement: root,
    querySelector: (selector: string) => (selector === 'meta[name="theme-color"]' ? meta : null),
  });

  return {
    root,
    meta,
    storage,
    isDark: () => classes.has("dark"),
    /** Simula a mudança de tema do sistema operacional. */
    setSystemDark(value: boolean) {
      prefersDark = value;
      for (const listener of mediaListeners) listener();
    },
    mediaListenerCount: () => mediaListeners.size,
    /** Simula outra aba escrevendo no localStorage (evento `storage`). */
    otherTabWrites(key: string | null, value?: string) {
      if (key === null) storage.data.clear();
      else if (value !== undefined) storage.data.set(key, value);
      const event = Object.assign(new Event("storage"), { key });
      events.dispatchEvent(event);
    },
  };
}
