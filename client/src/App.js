import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./components/Landing";
import { Login } from "./components/Login";
import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth } from "./auth/RequireAuth";
import { AuthCallback } from "./auth/AuthCallback";

export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route index element={<Login />} />
                    <Route path="auth" element={<AuthCallback />} />
                    <Route path="landing" element={<RequireAuth><Landing /></RequireAuth>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
  