import { parseAsString, useQueryState } from "nuqs";

// In nuqs, the useQueryState hook is a React hook that synchronizes a state variable with the URL query string (the part after ? in the URL).

// It lets you treat query parameters like React state — meaning you can read and write them easily, and the URL stays in sync automatically.

export function useSearchParam(key: string) {
  return useQueryState(
    key,
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }) // If we get any falsy value in the url, withOptions removes it directly!
  );
}
