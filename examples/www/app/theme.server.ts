import { createCookieSessionStorage } from "@remix-run/node";
import { Theme, isTheme } from "@josuerhea/remix-themes";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "rt-theme",
    secure: true,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cret1"],
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
