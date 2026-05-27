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
        <div className="min-h-screen bg-gray-50">
            {appLoading === true ?
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm">Đang tải...</p>
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
