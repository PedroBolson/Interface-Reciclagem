import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import PartnerPage from './pages/PartnerPage'
import AppDownloadPage from './pages/AppDownloadPage'
import UserProgramPage from './pages/UserProgramPage'
import BusinessProgramPage from './pages/BusinessProgramPage'
import './index.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))

    // AQUI ESTÁ A CORREÇÃO: aplicar a classe 'dark' no documento
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Página de Login
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Esta página será implementada em breve
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Formulário de login em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  )

  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Página de Cadastro
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Esta página será implementada em breve
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Formulário de cadastro em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'
        }`}>
        <Routes>
          <Route
            path="/"
            element={<LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/partner"
            element={<PartnerPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/app"
            element={<AppDownloadPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/user-program"
            element={<UserProgramPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/business-program"
            element={<BusinessProgramPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App