import { useState, useEffect } from 'react';

const MatthewPage = () => <h1>매튜 페이지</h1>;
const DeweyPage = () => <h1>듀이 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Link = ({ to, children }: any) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, '', to); 

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return (
    <a href={to} onClick={handleClick} style={{ marginRight: '10px', color: 'blue' }}>
      {children}
    </a>
  );
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/matthew':
        return <MatthewPage />;
      case '/dewey':
        return <DeweyPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <Link to="/matthew">MATTHEW</Link>
        <Link to="/dewey">DEWEY</Link>
      </nav>
      <hr />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;