import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import TestSelectionPage from './pages/TestSelectionPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tests" element={<TestSelectionPage />} />
        <Route path="/editor/:testId" element={<EditorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
