"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SectionWrapper from "@/hoc/sectionWrapper";
import { Pencil, PlusCircle, Trash2, Users } from "lucide-react";
import Link from "next/link";

// Mock user data
const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
    { id: "3", name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active" },
    { id: "4", name: "Bob Johnson", email: "bob@example.com", role: "Moderator", status: "Active" },
];

// interface roleColorsType {
//     Admin: string,
//     User: string,
//     Moderator: string,
// }

// const roleColors: roleColorsType = {
//     Admin: "bg-red-500 text-white",
//     User: "bg-blue-500 text-white",
//     Moderator: "bg-green-500 text-white",
// };

export default function UsersPage() {
    return (
        <SectionWrapper>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        User Management
                    </h1>
                    <Link href="/admin/users/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New User
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>


                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={"bg-gray-500 text-white"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/users/edit/${user.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </SectionWrapper>
    );
}
