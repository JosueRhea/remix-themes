import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
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
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

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
