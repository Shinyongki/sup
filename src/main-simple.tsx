import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ 숲체험 교육 관리 시스템</h1>
      <p>React 앱이 정상적으로 실행되고 있습니다!</p>
      <hr />
      <h3>체크리스트:</h3>
      <ul>
        <li>✅ React 설치 완료</li>
        <li>✅ Vite 설정 완료</li>
        <li>✅ 개발 서버 실행 중</li>
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)