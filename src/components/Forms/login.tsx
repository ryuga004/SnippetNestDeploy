"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadRouter } from "@/lib/uploadthing";
import { useAppDispatch } from "@/redux/redux-hooks";
import { setUser } from "@/redux/slice/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    avatar: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginRegister() {
    const [isRegister, setIsRegister] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        dispatch(
            setUser({
                id: crypto.randomUUID(),
                username: data.username,
                email: data.email,
                avatar: avatarUrl || "",
            })
        );
        alert(isRegister ? "Registered successfully!" : "Logged in successfully!");
    };

    return (
        // <div>
        //     <aside>
        //         <img
        //             src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        //             alt="loginImage"
        //         />
        //     </aside>
        //     <main>

        //     </main>
        // </div>
        <Card className="">
            <CardHeader>
                <CardTitle className="text-2xl">{isRegister ? "Register" : "Login"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {isRegister && (
                        <>
                            <Label>Upload Avatar</Label>
                            <UploadDropzone<UploadRouter, "avatarUpload">
                                endpoint="avatarUpload"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]?.url) {
                                        setAvatarUrl(res[0].key);
                                        setValue("avatar", res[0].key);
                                    }
                                }}
                                onUploadError={(error) => {
                                    console.error("Upload error:", error);
                                }}
                            />
                            {avatarUrl && <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="rounded-full" />}
                        </>
                    )}

                    {isRegister && (
                        <>
                            <Label>Username</Label>
                            <Input {...register("username")} placeholder="Enter your username" />
                            {errors.username && <p className="text-red-500 h-[50vh]">{errors.username.message}</p>}
                        </>
                    )}

                    <Label>Email</Label>
                    <Input {...register("email")} type="email" placeholder="Enter your email" />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                    <Label>Password</Label>
                    <Input {...register("password")} type="password" placeholder="Enter your password" />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : isRegister ? "Register" : "Login"}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-center">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Login" : "Register"}
                    </Button>
                </p>
            </CardContent>
        </Card>
    );
}
