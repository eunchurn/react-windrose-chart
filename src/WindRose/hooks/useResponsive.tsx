import React from "react";

export function useResponsive(
  elRef: React.RefObject<HTMLDivElement>,
  initSize: { width: number; height: number },
) {
  const [size, setSize] = React.useState(initSize);
  const observer = React.useRef(
    new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    }),
  );
  React.useEffect(() => {
    const { current } = elRef;
    if (current) {
      observer.current.observe(current);
      return () => {
        observer.current.unobserve(current);
      };
    }
    return;
  }, [elRef, observer]);
  return size;
}
