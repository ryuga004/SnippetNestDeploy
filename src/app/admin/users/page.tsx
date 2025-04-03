"use client";

import CircularLoader from "@/components/Loaders/circularLoader";
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
import { GET_ALL_USER, UPDATE_USER } from "@/lib/services";
import { useMutation, useQuery } from "@apollo/client";
import { User } from "@prisma/client";
import { Shield, ShieldOff, Trash2, Users } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USER);

  const [updateUser] = useMutation(UPDATE_USER);
  const handleUpdateRole = async (role: string = "USER", id?: string) => {
    if (!id) return;
    const res = await updateUser({
      variables: {
        updateUserId: id,
        input: {
          role,
        },
      },
    });
    if (res.data.updateUser.success) {
      refetch();
    }
  };
  if (loading) {
    return <CircularLoader />;
  }
  if (error) return <p>Error fetching users: {error.message}</p>;
  return (
    <SectionWrapper>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h1>
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
                      <AvatarImage
                        className="object-cover"
                        src={user?.avatar || "/user_logo.png"}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="text-xs">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-medium ">
                    <Button variant="link" className="hover:text-blue-500">
                      <Link href={`/profile/${user.id}`}>{user.username}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "USER"
                          ? "bg-gray-500 text-white"
                          : "bg-orange-500 text-white"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        className="bg-blue-100 hover:bg-blue-200"
                        size="sm"
                        onClick={() =>
                          handleUpdateRole(
                            user.role === "ADMIN" ? "USER" : "ADMIN",
                            user.id
                          )
                        }
                      >
                        {user.role === "USER" ? (
                          <Shield className="h-4 w-4" color="blue" />
                        ) : (
                          <ShieldOff className="h-4 w-4" color="blue" />
                        )}
                      </Button>
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
