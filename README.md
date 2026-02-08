# breakpoint-utils

Lightweight utilities for querying responsive breakpoints and viewport width in JavaScript and React.

## Installation

```bash
npm install breakpoint-utils
```

## Features

- **Configurable breakpoints** - Use defaults or define your own
- **Imperative API** - `up`, `down`, `only`, `not`, `between` for use anywhere
- **React hooks** - `useUp`, `useDown`, `useOnly`, `useNot`, `useBetween` for reactive components
- **Viewport measurements** - `useViewport` for pixel-based calculations
- **CSS parity** - Uses `matchMedia` for exact CSS behavior
- **Lightweight** - Minimal dependencies
- **TypeScript** - Full type safety

## Default Breakpoints

| Name | Min Width |
|------|-----------|
| `xs` | 480px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Configuration

### `configure(breakpoints)`

Replace the default breakpoints with your own. Must be called before any components mount.

```typescript
import { configure } from 'breakpoint-utils';

configure({
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
});
```

### `getBreakpoints()`

Get the current breakpoint configuration.

```typescript
const breakpoints = getBreakpoints();
// { xs: 480, sm: 640, ... } or your custom config
```

## Imperative API

Use these in event handlers, utility functions, or anywhere outside of React rendering.

All functions accept a named breakpoint string. `up`, `down`, and `between` also accept a number for ad-hoc pixel values.

### `up(size)`

Returns `true` if viewport width is >= the breakpoint.

```typescript
up('md')  // viewport >= 768px
up(900)   // viewport >= 900px
```

### `down(size)`

Returns `true` if viewport is **below** the breakpoint (does not include it).

```typescript
down('lg') // viewport < 1024px
down(900)  // viewport < 900px
```

### `only(size)`

Returns `true` if viewport is within the breakpoint range (>= size and < next breakpoint).

```typescript
only('md') // 768px <= viewport < 1024px
```

### `not(size)`

Returns `true` if viewport is outside the breakpoint range.

```typescript
not('md') // viewport < 768px OR viewport >= 1024px
```

### `between(minSize, maxSize)`

Returns `true` if viewport is between two breakpoints.

```typescript
between('sm', 'lg')  // 640px <= viewport < 1024px
between(600, 900)    // 600px <= viewport < 900px
between('sm', 900)   // mix named + numeric
```

> **Note:** These functions return a one-shot result at call time. In React, use the hooks below for reactive updates. Outside React, you can pair with the `viewport` singleton to re-check on viewport changes:
>
> ```typescript
> import { up, viewport } from 'breakpoint-utils';
>
> // viewport exposes getWidth() and onResize() for manual subscription
> const unsubscribe = viewport.onResize(() => {
>   console.log('Is desktop:', up('lg'));
> });
>
> // Clean up when no longer needed
> unsubscribe();
> ```

## React Hooks

Each hook mirrors its imperative counterpart but reactively re-renders the component when the result changes. Like the imperative API, `useUp`, `useDown`, and `useBetween` accept numbers as well as named breakpoints.

### `useUp(size)`

Returns `true` if viewport width is >= the breakpoint.

```typescript
const isDesktop = useUp('lg');  // viewport >= 1024px
const isWide = useUp(900);      // viewport >= 900px
```

### `useDown(size)`

Returns `true` if viewport is **below** the breakpoint (does not include it).

```typescript
const isMobile = useDown('md'); // viewport < 768px
const isNarrow = useDown(600);  // viewport < 600px
```

### `useOnly(size)`

Returns `true` if viewport is within the breakpoint range.

```typescript
const isTabletOnly = useOnly('md'); // 768px <= viewport < 1024px
```

### `useNot(size)`

Returns `true` if viewport is outside the breakpoint range.

```typescript
const isNotTablet = useNot('md'); // viewport < 768px OR viewport >= 1024px
```

### `useBetween(minSize, maxSize)`

Returns `true` if viewport is between two breakpoints.

```typescript
const isSmallToMedium = useBetween('sm', 'lg'); // 640px <= viewport < 1024px
const isCustomRange = useBetween(600, 900);     // 600px <= viewport < 900px
```

> **SSR Note:** All hooks return `false` during server-side rendering until hydration completes.

### `useViewport()`

Returns the current viewport width in pixels. Use for pixel-based calculations (drag/resize logic, canvas, charts, virtualization):

```typescript
import { useViewport } from 'breakpoint-utils';

function ResizablePanel() {
  const width = useViewport();
  const panelWidth = Math.min(width * 0.8, 600);

  return <div style={{ width: panelWidth }} />;
}
```

> **Note:** Use breakpoint hooks (`useUp`, etc.) for responsive layouts. Use `useViewport` only when you need actual pixel values for calculations.

## Migrating from v1.0.0

In v1.0.0, reactive breakpoint checks required `useViewport()` to trigger re-renders:

```typescript
import { useViewport, up } from 'breakpoint-utils';

function MyComponent() {
  useViewport(); // re-renders on every pixel change
  const isDesktop = up('lg');
  return isDesktop ? <DesktopNav /> : <MobileNav />;
}
```

This still works, but the dedicated hooks are preferred — they only re-render when a breakpoint boundary is crossed:

```typescript
// v2.0.0+ — dedicated hooks
import { useUp } from 'breakpoint-utils';

function MyComponent() {
  const isDesktop = useUp('lg'); // re-renders only at 1024px boundary
  return isDesktop ? <DesktopNav /> : <MobileNav />;
}
```

## TypeScript

```typescript
import { configure, up, type Breakpoints } from 'breakpoint-utils';

const myBreakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
} satisfies Breakpoints;

configure(myBreakpoints);

// Type-safe breakpoint names
type MyBreakpoint = keyof typeof myBreakpoints;
const size: MyBreakpoint = 'md';
```

## License

MIT
