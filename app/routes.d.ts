declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/:link": { "link": string };
    "/links": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/:link", RouteParams["/:link"]]
      | ["/links"]
  >(...args: T): typeof args[0];
}
