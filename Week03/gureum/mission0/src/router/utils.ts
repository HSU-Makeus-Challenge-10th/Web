export const getCurrentPath = (): string => window.location.pathname;

export const navigateTo = (
  to: string,
  options?: { replace?: boolean; state?: unknown }
) => {
  const method: "pushState" | "replaceState" = options?.replace
    ? "replaceState"
    : "pushState";

  window.history[method](options?.state ?? {}, "", to);
  window.dispatchEvent(new Event("app:navigate"));
};
