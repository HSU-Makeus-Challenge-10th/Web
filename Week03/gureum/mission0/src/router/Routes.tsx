import React, { Children, cloneElement, isValidElement, useMemo, type FC } from "react";
import { useCurrentPath } from "./hooks/useCurrentPath";
import type { RouteProps, RoutesProps } from "./types";

const isRouteElement = (
  child: unknown
): child is React.ReactElement<RouteProps> => {
  if (!isValidElement(child)) {
    return false;
  }

  const props = child.props as RouteProps;

  return typeof props.path === "string" && typeof props.component === "function";
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement) as React.ReactElement<RouteProps>[];

    return routes.find((routeElement) => routeElement.props.path === currentPath) ?? null;
  }, [children, currentPath]);

  if (!activeRoute) {
    return null;
  }

  return cloneElement(activeRoute);
};
