import React, { useState, useEffect, useMemo, Children, cloneElement, isValidElement } from 'react';
import type { ReactNode, ReactElement, FC } from 'react';

const useCurrentPath = () => {
    const [path, setPath] = useState(window.location.pathname);
    useEffect(() => {
        const handler = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);
    return path;
};

interface RouteProps {
    path: string;
    component: React.ComponentType;
}

export const Route = ({ component: Component }: RouteProps) => {
    return <Component />;
};

export const Link = ({ to, children }: { to: string; children: ReactNode }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };
    return <a href={to} onClick={handleClick}>{children}</a>;
};

// any 대신 unknown을 사용해 eslint 에러 방지
const isRouteElement = (child: unknown): child is ReactElement<RouteProps> => {
    return isValidElement(child) && child.type === Route;
};

export const Routes: FC<{ children: ReactNode }> = ({ children }) => {
    const currentPath = useCurrentPath();
    const activeRoute = useMemo(() => {
        const routes = Children.toArray(children).filter(isRouteElement);
        return routes.find((route) => route.props.path === currentPath);
    }, [children, currentPath]);

    if (!activeRoute) return null;
    return cloneElement(activeRoute);
};