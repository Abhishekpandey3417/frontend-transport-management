import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "driver",
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

        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", formData);

            toast.success("Account created successfully");

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Signup failed"
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
                    Signup
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full border p-3 rounded"
                    onChange={changeHandler}
                />

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

                <select
                    name="role"
                    className="w-full border p-3 rounded"
                    onChange={changeHandler}
                    value={formData.role}
                >
                    <option value="driver">Driver</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded"
                >
                    {loading ? "Creating..." : "Signup"}
                </button>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;