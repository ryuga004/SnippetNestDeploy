"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { GET_ALL_USER } from "@/lib/services";
import { useQuery } from "@apollo/client";
import { User } from "@prisma/client";
import { Pencil, PlusCircle, Trash2, Users } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
    const { data, loading, error } = useQuery(GET_ALL_USER);
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) return <p>Error fetching users: {error.message}</p>;
    return (
        <SectionWrapper>
            <div className="container mx-6 py-8">
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
                                <TableHead>Avatar</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>


                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.getAllUsers?.users?.map((user: Partial<User>) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar className="cursor-pointer w-8 h-8 bg-red-500">
                                            <AvatarImage className="object-cover" src={user?.avatar || "/user_logo.png"} alt="User Avatar" />
                                            <AvatarFallback className="text-xs">{user.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                        </Avatar>

                                    </TableCell>

                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={"bg-gray-500 text-white"}>
                                            {user?.role ? user.role : "USER"}
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
