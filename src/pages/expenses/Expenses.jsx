import { useEffect, useState } from "react";
import api from "../../services/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // if you later add ExpenseForm

    const fetchExpenses = async () => {
        setLoading(true);

        try {
            const res = await api.get("/expenses");
            setExpenses(res.data.data || []);
        } catch (err) {
            console.log("Expense fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div>
            <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-bold">
                    Expenses
                </h1>

                <Button onClick={() => setOpen(true)}>
                    + Add Expense
                </Button>
            </div>

            <div className="bg-white border rounded-lg p-4">
                {loading ? (
                    <p className="p-4 text-gray-500">
                        Loading expenses...
                    </p>
                ) : expenses.length === 0 ? (
                    <p className="p-4 text-gray-500">
                        No expenses found
                    </p>
                ) : (
                    expenses.map((e) => (
                        <div
                            key={e.id}
                            className="border-b p-3 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">
                                    {e.title}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {e.description}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">
                                    ₹ {e.amount}
                                </p>

                                <Badge>{e.category || "General"}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}