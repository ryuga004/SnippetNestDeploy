
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "../prisma";
import { User } from "@prisma/client";

const SECRET = process.env.JWT_SECRET!
interface Context {
    user?: User
}
export const registerUser = async (
    _: unknown,
    { avatar, username, email, password }: { avatar?: string; username: string; email: string; password: string }
) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            throw new Error("Username or email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                avatar: avatar ? avatar : "/user_logo.png",
                username,
                email,
                password: hashedPassword,
                points: 0,
                stats: { create: { contributions: 0, rank: 0, problemSolved: 0 } },
            },
        });

        return {
            success: true,
            message: "User registered successfully",
            user: newUser,
        };
    } catch {
        throw new Error("Something went wrong");
    }
}


export const loginUser = async (
    _: unknown,
    { username, password }: { username: string; password: string }
) => {
    try {

        const user = await prisma.user.findFirst({
            where: { username },
        });

        if (!user) {
            throw new Error("Invalid username or password");
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }


        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: "7d" });

        const cookieStore = await cookies();
        cookieStore.set("auth", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return {
            success: true,
            message: "Login successful",
            user: user,
        };
    } catch {
        throw new Error("Something went wrong");
    }
}

export const getUserFromToken = async (token?: string) => {
    try {
        if (!token) return null;
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        return await prisma.user.findUnique({ where: { id: decoded.userId } });
    } catch {
        console.error("Auth Error:");
        return null;
    }
};


export const GetMe = async (_: unknown, __: unknown, context: Context) => {
    if (!context.user) {
        throw new Error("Unautenticated: Please log in");
    }
    return {
        success: true,
        message: "current user fetched",
        user: context.user,
    }
}
export const getAllUsers = async (_: unknown, __: unknown, context: Context) => {
    if (context?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Only for admin use ");
    }
    const all_user = await prisma.user.findMany({ include: { social: true, stats: true, achievements: true } });
    return {
        success: true,
        message: "sucessfully fetched all users",
        users: all_user
    }
}

export const getUserById = async (_: unknown, { id }: { id: string }) => {
    const _user = await prisma.user.findUnique({
        where: { id },
        include: {
            social: true,
            achievements: true,
            stats: true,
        },
    });

    if (!_user) {
        throw new Error("User Does Not Exists");
    }

    return {
        success: true,
        message: "sucessfully fetch user",
        user: _user
    }
}

export const deleteUser = async (_: unknown, { id }: { id: string }) => {
    const deleteUser = await prisma.user.delete({
        where: { id },
    })
    if (!deleteUser) {
        throw new Error("User Does Not Exists");
    }
    return {
        success: true,
        message: "sucessfully deleted user",
    }
}

export const logoutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth");
    return {
        success: true,
        message: "User logged out successfully",
    };
};



export const updateUser = async (_: unknown, { id, input }: { id: string; input: Partial<User> }) => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return {
                success: false,
                message: "User not found",
                user: null,
            };
        }

        // Filter out undefined fields
        const filteredInput = Object.fromEntries(
            Object.entries(input).filter(([, value]) => value !== undefined)
        );


        if (Object.keys(filteredInput).length === 0) {
            return {
                success: false,
                message: "No valid fields provided for update",
                user: null,
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: filteredInput,
        });

        return {
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        };
    } catch {
        throw new Error("Something went wrong");
    }
};
