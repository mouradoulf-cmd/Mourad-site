// Must match `basePath` in next.config.ts — next/image doesn't prepend it automatically.
export const BASE_PATH = "/Mourad-site/basilico";

export function withBasePath(path: string) {
  return `${BASE_PATH}${path}`;
}
