import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TableControls({
    search,
    setSearch,
    status,
    setStatus,
    onAdd,
    title,
}) {
    return (
        <div className="flex justify-between mb-4 gap-3">
            <h1 className="text-xl font-bold">{title}</h1>

            <div className="flex gap-2">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

                <Button onClick={onAdd}>+ Add</Button>
            </div>
        </div>
    );
}