import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { CartContext } from "./components/context/cart.context";

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
    const { fetchCart } = useContext(CartContext);

    useEffect(() => {
        const fetchAccount = async () => {
            setAppLoading(true);
            const res = await axios.get(`/v1/api/account`);
            if (res && !res.message) {
                setAuth({
                    isAuthenticated: true,
                    user: { email: res.email, name: res.name }
                });
                // Fetch cart khi user đã đăng nhập
                fetchCart();
            }
            setAppLoading(false);
        }
        fetchAccount();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50">
            {appLoading === true ?
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-xs font-semibold">Đang tải TechNexus...</p>
                    </div>
                </div>
                :
                <>
                    <Header />
                    <Outlet />
                </>
            }
        </div>
    )
}
export default App;
