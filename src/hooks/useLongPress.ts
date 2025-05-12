import { useCallback, useRef } from "react";

type Event = React.MouseEvent | React.TouchEvent;

type ExtendedCSS = CSSStyleDeclaration & {
  webkitTouchCallout?: string;
  webkitUserSelect?: string;
};

interface LongPressOptions {
  ms?: number;
  stopPropagationOnStart?: boolean;
}

export function useLongPress(callback: (e: Event) => void, options?: LongPressOptions) {
  const { ms = 500, stopPropagationOnStart = false } = options || {};
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRef = useRef(false);

  const setNoSelectStyles = useCallback(() => {
    const style = document.body.style as ExtendedCSS;
    style.userSelect = "none";
    style.webkitUserSelect = "none";
    style.webkitTouchCallout = "none";
  }, []);

  const clearNoSelectStyles = useCallback(() => {
    const style = document.body.style as ExtendedCSS;
    style.userSelect = "";
    style.webkitUserSelect = "";
    style.webkitTouchCallout = "";
  }, []);

  const start = useCallback(
    (e: Event) => {
      if ("button" in e && e.button !== 0) return;
      if (stopPropagationOnStart) {
        e.stopPropagation();
      }
      triggeredRef.current = false;

      timerRef.current = setTimeout(() => {
        callback(e);
        triggeredRef.current = true;
        setNoSelectStyles();
      }, ms);
    },
    [callback, ms, stopPropagationOnStart, setNoSelectStyles],
  );

  const clear = useCallback(
    (e?: Event) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (triggeredRef.current && e) {
        e.preventDefault();
        e.stopPropagation();
      }
      triggeredRef.current = false;
      clearNoSelectStyles();
    },
    [clearNoSelectStyles],
  );

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
