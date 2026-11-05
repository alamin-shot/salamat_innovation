"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";

export function AssetCategoryTable({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    return (
        <div className="flex flex-col h-full overflow-hidden w-full p-4">
            <Table containerClassName="w-full">
                <TableHeader>
                    <TableHeadCell>Category Name</TableHeadCell>
                    <TableHeadCell>Prefix Code</TableHeadCell>
                    <TableHeadCell>Lifespan (Months)</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {manager.categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-400">No categories found.</TableCell>
                        </TableRow>
                    ) : (
                        manager.categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-bold text-gray-900">{cat.name}</TableCell>
                                <TableCell className="font-mono text-gray-500">{cat.prefix}</TableCell>
                                <TableCell>{cat.defaultLifespanMonths} months</TableCell>
                                <TableCell>{cat.status}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}