"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CodingProblemType } from "@/lib/types";
import { useRouter } from "next/navigation";

const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

const difficultyColors: Record<string, string> = {
  easy:
    "bg-green-100 text-green-700 border border-green-300  hover:bg-color-green-300",
  medium:
    "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-color-yellow-300",
  hard: "bg-red-100 text-red-700 border border-red-300 hover:bg-color-red-300",
};
export function ProblemsTable({ problems }: { problems: CodingProblemType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    VisibilityState
  >({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const columns: ColumnDef<CodingProblemType>[] = [
    {
      accessorKey: "sno",
      header: "S.No",
      cell: ({ row }) => <span className="text-gray-700">{row.index + 1}</span>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-gray-900 hover:bg-gray-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <span
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            onClick={() => router.push(`/problem/${row.original.id}`)}
          >
            {row.original.title}
          </span>
        );
      },
    },
    {
      accessorKey: "topic",
      header: () => (
        <Button variant="ghost" className="text-gray-900 hover:bg-gray-200">
          Topic
        </Button>
      ),
      cell: ({ row }) => {
        const topics = Array.isArray(row.original.topic)
          ? row.original.topic.filter(
              (topic) => topic !== null && topic !== undefined && topic !== ""
            )
          : [];

        return topics.map((top: string) => (
          <Badge className="rounded-lg px-3 py-1 mr-1 text-sm" key={top}>
            {top.toUpperCase()}
          </Badge>
        ));
      },
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="text-gray-900 hover:bg-gray-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const difficulty = row.original.difficulty;
        return (
          <Badge
            className={`rounded-lg px-3 py-1 text-sm ${
              difficultyColors[difficulty.toLowerCase()]
            }`}
          >
            {difficulty.toUpperCase()}
          </Badge>
        );
      },
      sortingFn: (rowA, rowB) => {
        return (
          difficultyOrder[rowA.original.difficulty] -
          difficultyOrder[rowB.original.difficulty]
        );
      },
    },
  ];
  const table = useReactTable({
    data: problems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search problems..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border border-gray-300 focus:ring-2 focus:ring-blue-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border-gray-300 hover:bg-gray-100"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border border-gray-300 shadow-md"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-gray-800"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border border-gray-300 overflow-hidden">
        <Table className="text-gray-900">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-300"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-700 font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-100"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-100"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
