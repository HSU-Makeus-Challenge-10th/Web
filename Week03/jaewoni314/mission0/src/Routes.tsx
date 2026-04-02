import React, { Children, cloneElement, useMemo } from 'react';
import type { ReactElement } from 'react';
import { useCurrentPath } from './useCurrentPath.ts';
import type { RouteProps } from './Route.tsx';

interface RoutesProps {
  children: ReactElement<RouteProps>[];
}

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    return Children.toArray(children).find(
      (child) =>
        React.isValidElement<RouteProps>(child) &&
        child.props.path === currentPath
    ) as ReactElement<RouteProps> | undefined;
  }, [children, currentPath]);

  if (!activeRoute) return <h1>404 Not Found</h1>;

  return cloneElement(activeRoute);
};
