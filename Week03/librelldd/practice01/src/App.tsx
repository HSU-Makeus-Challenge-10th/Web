import { useState, useEffect } from 'react';

function App() {
  // 1. 현재 주소창의 경로(pathname)를 관리할 리액트 상태입니다.
  // 이 상태가 바뀌어야 리액트가 화면을 다시 그려줍니다.
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // 2. 페이지 이동을 처리하는 커스텀 함수입니다. (React Router의 navigate 역할)
  const navigate = (to: string) => {
    // [중요] 브라우저 주소창만 바꾸고 페이지 새로고침은 막습니다.
    window.history.pushState({}, '', to);
    
    // 주소창만 바꾸면 리액트가 모르기 때문에, 상태를 강제로 업데이트합니다.
    setCurrentPath(to);
  };

  // 3. 사용자가 브라우저 '뒤로 가기'를 눌렀을 때를 처리합니다.
  useEffect(() => {
    const handlePopState = () => {
      // 뒤로 가기로 바뀐 주소를 다시 상태에 반영합니다.
      setCurrentPath(window.location.pathname);
    };

    // 브라우저의 popstate 이벤트를 구독합니다.
    window.addEventListener('popstate', handlePopState);
    
    // 컴포넌트가 사라질 때 이벤트 리스너를 제거합니다. (메모리 관리)
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div style={{ padding: '30px', lineHeight: '1.8' }}>
      <h1>History API로 구현한 SPA 🚀</h1>
      
      {/* 네비게이션 바 */}
      <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button onClick={() => navigate('/')}>홈으로 이동</button>
        <button onClick={() => navigate('/about')}>소개 페이지로</button>
      </nav>

      <hr />

      {/* 현재 경로에 따라 다른 화면을 보여주는 '라우팅' 로직 */}
      <main style={{ marginTop: '20px' }}>
        {currentPath === '/' && (
          <section>
            <h2>🏠 홈 화면입니다.</h2>
            <p>이동 버튼을 눌러보세요. 페이지 새로고침 없이 화면이 바뀝니다!</p>
          </section>
        )}

        {currentPath === '/about' && (
          <section>
            <h2>ℹ️ 소개 페이지입니다.</h2>
            <p>History API의 <code>pushState</code> 덕분에 주소만 싹 바뀌는 중입니다.</p>
          </section>
        )}

        {/* 등록되지 않은 주소 처리 (404) */}
        {!['/', '/about'].includes(currentPath) && (
          <section>
            <h2 style={{ color: 'orange' }}>⚠️ 404 - 찾을 수 없는 페이지</h2>
            <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;