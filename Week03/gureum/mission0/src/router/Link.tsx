import type { MouseEvent } from "react";
import type { LinkProps } from "./types";
import { getCurrentPath, navigateTo } from "./utils";

export const Link = ({ to, replace, children }: LinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (getCurrentPath() === to) {
      return;
    }

    navigateTo(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
