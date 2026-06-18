import { createContext, useContext, useRef, useCallback } from "react";

/**
 * ScrollContext
 * Solves: window.scrollTo() fails when the scrollable element
 * is a layout container (not the window itself).
 *
 * Usage:
 *  1. Wrap <App> with <ScrollProvider>
 *  2. In HomeLayout → attach `ref` to the scrollable <main>
 *  3. ScrollToTop + ScrollToTopButton use `scrollToTop` from this context
 */

const ScrollCtx = createContext(null);

export function ScrollProvider({ children }) {
  // ref → will be attached to the scrollable layout container in HomeLayout
  const ref = useRef(null);

  // scroll to top — tries container first, falls back to window
  const scrollToTop = useCallback((behavior = "instant") => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, left: 0, behavior });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, []);

  // get current scroll position
  const getScrollY = useCallback(() => {
    return ref.current ? ref.current.scrollTop : window.scrollY;
  }, []);

  return (
    <ScrollCtx.Provider value={{ ref, scrollToTop, getScrollY }}>
      {children}
    </ScrollCtx.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollCtx);
