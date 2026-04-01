import { type ReactNode, type ReactElement, useEffect, useState } from "react";

export const Link = ({ to, children }: { to: string; children: ReactNode }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return <a href={to} onClick={handleClick}>{children}</a>;
};

export const Route = ({ path, component }: { path: string; component: () => ReactElement }) => {
  return null;
};

export const Routes = ({ children }: { children: any }) => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  let element = null;

  children.forEach((child: any) => {
    if (child.props.path === path) {
      const Component = child.props.component;
      element = <Component />;
    }
  });

  return element;
};