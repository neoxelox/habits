import { useCallback, useRef } from "react";

export function useLongPress(callback: (e: React.MouseEvent | React.TouchEvent) => void, ms = 500) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const firedRef = useRef(false);

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent context menu on long press
      if ("preventDefault" in e) e.preventDefault();
      firedRef.current = false;
      timerRef.current = setTimeout(() => {
        callback(e);
        firedRef.current = true;
      }, ms);
    },
    [callback, ms],
  );

  const clear = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Prevent click after long press
    if (firedRef.current && e && "preventDefault" in e) {
      e.preventDefault();
      e.stopPropagation && e.stopPropagation();
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      if (!firedRef.current) {
        callback(e);
        firedRef.current = true;
      }
    },
  };
}
