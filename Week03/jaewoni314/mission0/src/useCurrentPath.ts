import { useEffect, useState } from 'react';
import { getCurrentPath } from './utils.ts';

export function useCurrentPath(): string {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handleLocationChange = () => setPath(getCurrentPath());
    //popstate: 뒤로가기 / 앞으로가기 시 발생
    window.addEventListener('popstate', handleLocationChange);
    //pushstate: navigateTo() 호출 시 발생
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  return path;
}
