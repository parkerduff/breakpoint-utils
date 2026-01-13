# breakpoint-utils

Lightweight utilities for querying responsive breakpoints and viewport width in JavaScript and React.

## Installation

```bash
npm install breakpoint-utils
```

## Features

- **Configurable breakpoints** - Use defaults or define your own
- **Responsive utilities** - `up`, `down`, `only`, `not`, `between`
- **React hook** - `useViewport` for reactive viewport width
- **Lightweight** - Minimal dependencies
- **TypeScript** - Full type safety

## Quick Start

### Default Breakpoints

```typescript
import { up, down, only } from 'breakpoint-utils';

// Default breakpoints: xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536

if (up('md')) {
  // viewport >= 768px
}

if (down('lg')) {
  // viewport < 1024px
}

if (only('sm')) {
  // 640px <= viewport < 768px
}
```

### Custom Breakpoints

```typescript
import { configure, up, down } from 'breakpoint-utils';

// Define your own breakpoints
configure({
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
});

if (up('tablet')) {
  // viewport >= 768px
}
```

## API

### `configure(breakpoints)`

Set custom breakpoints. Must be called before using utility functions.

```typescript
configure({
  small: 600,
  medium: 900,
  large: 1200,
});
```

### `getBreakpoints()`

Get the current breakpoint configuration.

```typescript
const breakpoints = getBreakpoints();
// { xs: 480, sm: 640, ... } or your custom config
```

### `up(size)`

Returns `true` if viewport width is >= the breakpoint.

```typescript
up('md') // viewport >= 768px
```

### `down(size)`

Returns `true` if viewport width is < the breakpoint.

```typescript
down('lg') // viewport < 1024px
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
between('sm', 'lg') // 640px <= viewport < 1024px
```

## React Hook

### `useViewport()`

React hook that returns the current viewport width and updates on resize.

```typescript
import { useViewport, configure, up } from 'breakpoint-utils';

// Optional: configure custom breakpoints
configure({
  mobile: 375,
  tablet: 768,
  desktop: 1024,
});

function MyComponent() {
  const width = useViewport();
  
  return (
    <div>
      <p>Viewport width: {width}px</p>
      {up('tablet') && <p>Tablet or larger</p>}
    </div>
  );
}
```

## Direct Viewport Access

```typescript
import { viewport } from 'breakpoint-utils';

const width = viewport.getWidth();

const unsubscribe = viewport.onResize(() => {
  console.log('Viewport resized:', viewport.getWidth());
});

// Clean up
unsubscribe();
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
