import { Button } from "@/components/ui/button";

export default function PaginationBar({ pagination, setPage }) {
    return (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                disabled={pagination.page === 1}
                onClick={() => setPage(pagination.page - 1)}
            >
                Prev
            </Button>

            <span className="px-3 py-2">
                Page {pagination.page} / {pagination.totalPages}
            </span>

            <Button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
            >
                Next
            </Button>
        </div>
    );
}