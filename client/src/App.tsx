import { Outlet, useSearchParams, useNavigate } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hook/hook'
import { getMe } from './services/user';
import { loginUser } from './app/features/authSlice';
function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const isOAuthRedirect = searchParams.get("google_auth") === "true";
    if (!user && isOAuthRedirect) {
      const fetchUser = async () => {
        try {
          const user = await getMe();
          dispatch(loginUser(user));
          searchParams.delete("google_auth");
          navigate({ search: searchParams.toString() }, { replace: true });
        } catch (error: any) {
          console.error("OAuth session fetch failed:", error);
        }
      }
      fetchUser();
    }
  }, [user, dispatch, searchParams, navigate])
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
