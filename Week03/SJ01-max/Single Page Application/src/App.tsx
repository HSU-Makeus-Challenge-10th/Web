import { useEffect, useState } from 'react'
import './App.css'

function Home() {
  return <h2>홈 페이지입니다.</h2>
}

function About() {
  return <h2>소개 페이지입니다.</h2>
}

function Contact() {
  return <h2>연락처 페이지입니다.</h2>
}

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }

  const renderPage = () => {
    switch (path) {
      case '/':
        return <Home />
      case '/about':
        return <About />
      case '/contact':
        return <Contact />
      default:
        return <h2>404 - 페이지를 찾을 수 없습니다.</h2>
    }
  }

  return (
    <div className="container">
      <h1>React Router 없이 SPA 만들기</h1>

      <nav className="nav">
        <button onClick={() => navigate('/')}>홈</button>
        <button onClick={() => navigate('/about')}>소개</button>
        <button onClick={() => navigate('/contact')}>연락처</button>
      </nav>

      <div className="content">{renderPage()}</div>
    </div>
  )
}

export default App