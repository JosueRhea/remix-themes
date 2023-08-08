import { getCookie } from "./util";

export function getSSRTheme({ request }: { request: Request }) {
  const cookies = request.headers.get("Cookie");
  const theme = getCookie("rt-theme", cookies ?? "");
  return theme;
}
