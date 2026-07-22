import "@testing-library/jest-dom/vitest"

// jsdom does not implement several browser APIs relied on by @base-ui/react's
// floating-ui-based positioning (Dialog/Menu popups). Polyfill the minimum
// surface area needed so those components can mount in tests.
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }

  if (!("ResizeObserver" in window)) {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // @ts-expect-error - jsdom polyfill for tests
    window.ResizeObserver = ResizeObserverMock
  }

  if (!("IntersectionObserver" in window)) {
    class IntersectionObserverMock {
      root = null
      rootMargin = ""
      thresholds: number[] = []
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    // @ts-expect-error - jsdom polyfill for tests
    window.IntersectionObserver = IntersectionObserverMock
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }

  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {}
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {}
  }
}