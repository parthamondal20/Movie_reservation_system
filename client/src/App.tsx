import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Toaster position="top-center" />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
