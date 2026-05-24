import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Email and password required");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", formData);

            const { token, user } = response.data;

            if (!token || !user) {
                toast.error("Invalid server response");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Login successful");

            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={submitHandler}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">
                    Login
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full border p-3 rounded"
                    onChange={changeHandler}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="w-full border p-3 rounded"
                    onChange={changeHandler}
                />

                <button
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600">
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;