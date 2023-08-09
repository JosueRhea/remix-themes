import type { V2_MetaFunction } from "@remix-run/node";
import { Theme, Themed, useTheme } from "remix-themes";
// import { Theme, useTheme } from "remix-themes";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Remix themes" },
    { name: "description", content: "A package for managing themes in remix" },
  ];
};

export default function Page() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-y-4">
      <h1 className="text-3xl font-bold ">Remix themes :)</h1>
      <span>
        <Themed dark="switch to light mode" light="switch to dark mode" />
      </span>
      <p>
        just a wrapper of{" "}
        <a
          className="text-red-500"
          href="https://github.com/pacocoursey/next-themes"
          target="_blank"
          rel="noreferrer"
        >
          next-themes A
        </a>
      </p>
      <p>
        Active theme: <span className="text-red-500">{theme ?? ""}</span>
      </p>

      <select
        value={theme ?? ""}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}
