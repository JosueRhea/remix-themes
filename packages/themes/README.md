## Remix themes

Simple dark and light mode for remix with SSR

### Example

```tsx 
// root.tsx

import type { LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ThemeProvider, getSSRTheme, useTheme } from "remix-themes";

export function App() {
  const { theme } = useTheme();

  return (
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function loader({ request }: LoaderArgs) {
  const theme = getSSRTheme({ request });
  return { theme };
}

export default function AppWithProviders() {
  const data = useLoaderData();
  return (
    <ThemeProvider ssrTheme={data.theme} defaultTheme="dark">
      <App />
    </ThemeProvider>
  );
}
```

```tsx
// _index.tsx

export default function Page() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
        <p>
          Active theme: <span className="text-red-500">{theme}</span>
        </p>
        <select value={theme} onChange={e => setTheme(e.target.value as Theme)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
    </div>
  )
```