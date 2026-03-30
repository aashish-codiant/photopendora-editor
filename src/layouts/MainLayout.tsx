import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/shared/Navbar";

export default function MainLayout() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar handleLogout={handleLogout} />
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    );
}

