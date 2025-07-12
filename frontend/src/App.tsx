import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/home/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import AuthPage from "@/pages/auth/AuthPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from "@/stores/useAuthStore";

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path='/auth' element={<AuthPage />} />
          <Route 
            path='/admin' 
            element={
              isAuthenticated && user?.isAdmin ? (
                <AdminPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/albums/:albumId' element={<AlbumPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;