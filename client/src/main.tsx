import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import { store } from './app/store/store.ts'
const Home = lazy(() => import("./pages/Home.tsx"));
const SignIn = lazy(() => import("./pages/SignIn.tsx"));
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const Movies = lazy(() => import("./pages/Movies.tsx"));
const MoviePage = lazy(() => import("./pages/MoviePage.tsx"));
const PageNotFound = lazy(() => import("./pages/404Page.tsx"));
const TheatersPage = lazy(() => import("./pages/theatersPage.tsx"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<App />}>
      <Route path='/' element={<Home />} />
      <Route path='/movies' element={<Movies />} />
      <Route path='/login' element={<SignIn />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/movies/:movie_id' element={<MoviePage />} />
      <Route path='/movies/:movie_id/theaters' element={<TheatersPage />} />
      <Route path='*' element={<PageNotFound />} />
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>,
)
