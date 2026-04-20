import { useEffect } from "react";

const useHotKeys = (hotkeys) => {
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      hotkeys.forEach(({ keys, callback }) => {
        const ctrl = keys.ctrl ? e.ctrlKey || e.metaKey : true;
        const shift = keys.shift ? e.shiftKey || e.shift : true;
        const alt = keys.alt ? e.alt || e.altKey : true;
        const key = e.key.toLowerCase() === keys.key.toLowerCase();

        if (ctrl && shift && alt && key) {
          e.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkeys])
}

export default useHotKeys;
