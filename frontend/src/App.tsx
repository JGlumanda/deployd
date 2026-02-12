import { Routes, Route } from 'react-router'
import { ConfigProvider } from '@core/hooks/useConfig'
import ShowcasePage from './pages/ShowcasePage'
import AdminPage from './pages/AdminPage'
// Import themes to register them
import '@themes/index'

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<ShowcasePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </ConfigProvider>
  )
}

export default App
