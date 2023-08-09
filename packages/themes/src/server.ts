import { json, redirect, type ActionFunction } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import { Theme, isTheme } from "./provider";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "rt-theme",
    secure: true,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
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
      themeStorage.commitSession(session, { expires: new Date("2088-10-18") }),
  };
}

export { getThemeSession };

export const ThemeAction: ActionFunction = async ({ request }) => {
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
