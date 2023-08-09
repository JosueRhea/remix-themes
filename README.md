## Remix themes

Dark and light mode with SSR

### Installation

```bash
pnpm i @josuerhea/remix-themes
#or
npm i @josuerhea/remix-themes
```

### Usage

Firt create `app/theme.server.ts` to setup the session storage
```ts
// app/theme.server.ts

import { createCookieSessionStorage } from "@remix-run/node";
import { Theme, isTheme } from "@josuerhea/remix-themes";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "your-theme-name",
    secure: true,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["your-secret"],
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () =>
      // no theme for you on my 100th birthday! 😂
      themeStorage.commitSession(session, { expires: new Date("2088-10-18") }),
  };
}

export { getThemeSession };
```

Update the `app/root.tsx` file. You'll ned a extra component that look like this.

```tsx
// app/root.tsx
import type { LinksFunction, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { NonFlashOfWrongThemeEls, ThemeProvider, useTheme } from "@josuerhea/remix-themes";
import { getThemeSession } from "~/theme.server";
import stylesheet from "~/tailwind.css";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => [  
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderArgs) {
  const theme = await getThemeSession(request);

  return { theme: theme.getTheme() };
}

type LoaderData = SerializeFrom<typeof loader>;

export function App() {
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={theme ?? ""}>
      <head>
        {/* ... */}
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        {/* ... */}
      </head>
      <body>
        {/* .... */}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();
  
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
```

Create a new route in `app/routes/action.set-theme.tsx` that will contain the actions that saves the session storage.

```tsx
// app/routes/action.set-theme.tsx

import { json, type ActionFunction, redirect } from "@remix-run/node";
import { isTheme } from "@josuerhea/remix-themes";
import { getThemeSession } from "~/theme.server";

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");
  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme.`,
    });
  }

  themeSession.setTheme(theme);
  return json(
    { success: true },
    {
      headers: { "Set-Cookie": await themeSession.commit() },
    },
  );
};

export const loader = () => redirect("/", { status: 404 });
```

### useTheme
Now you can use the hook to see your current theme or change the theme.

```tsx
// app/routes/_index.tsx
import { Theme, Themed, useTheme } from "@josuerhea/remix-themes";

export default function Page() {
  const [theme, setTheme] = useTheme();

  return (
    <div>
      <p>
        Active theme: <span className="text-red-500">{theme ?? ""}</span>
      </p>
      <select
        value={theme ?? ""}s
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}
```