import type { V2_MetaFunction } from "@remix-run/node";
import { useTheme } from "remix-themes";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Remix themes" },
    { name: "description", content: "A package for managing themes in remix" },
  ];
};

export default function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-y-4">
      <h1 className="text-3xl font-bold ">Remix themes</h1>
      <p>
        just a wrapper of{" "}
        <a
          className="text-red-500"
          href="https://github.com/pacocoursey/next-themes"
          target="_blank"
          rel="noreferrer"
        >
          next-themes
        </a>
      </p>
      <p>
        Active theme: <span className="text-red-500">{theme}</span>
      </p>
      <div className="flex gap-x-2">
        <button
          className="px-4 py-2 border border-zinc-200 hover:border-zinc-400 transition-colors duration-300 rounded-md outline-none focus-visible:outline-zinc-400"
          onClick={() => setTheme("dark")}
          type="button"
        >
          Dark
        </button>
        <button
          className="px-4 py-2 border border-zinc-200 hover:border-zinc-400 transition-colors duration-300 rounded-md outline-none focus-visible:outline-zinc-400"
          onClick={() => setTheme("light")}
          type="button"
        >
          Light
        </button>
      </div>
    </div>
  );
}
