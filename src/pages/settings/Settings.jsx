import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const save = () => {
        localStorage.setItem("profile", JSON.stringify(profile));
        toast.success("Settings saved locally");
    };

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-5">Settings</h1>

            <div className="space-y-3 bg-white p-5 border rounded-lg">
                <Input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

                <Input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <Button onClick={save}>
                    Save Settings
                </Button>
            </div>
        </div>
    );
}