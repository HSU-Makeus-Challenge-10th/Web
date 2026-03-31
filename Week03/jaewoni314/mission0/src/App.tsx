import React from 'react';
import { Link } from './Link.tsx';
import { Route } from './Route';
import { Routes } from './Routes';

// 페이지 컴포넌트들
const MatthewPage: React.FC = () => <h1>매튜 페이지</h1>;
const AeongPage: React.FC = () => <h1>애옹 페이지</h1>;
const JoyPage: React.FC = () => <h1>조이 페이지</h1>;
const NotFoundPage: React.FC = () => <h1>404 - 페이지 없음</h1>;

// 헤더 네비게이션
const Header: React.FC = () => (
  <nav style={{ display: 'flex', gap: '10px' }}>
    <Link to="/matthew">MATTHEW</Link>
    <Link to="/aeong">AEONG</Link>
    <Link to="/joy">JOY</Link>
    <Link to="/not-found">NOT FOUND</Link>
  </nav>
);

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/matthew" component={MatthewPage} />
        <Route path="/aeong" component={AeongPage} />
        <Route path="/joy" component={JoyPage} />
        <Route path="/not-found" component={NotFoundPage} />
      </Routes>
    </>
  );
};

export default App;
