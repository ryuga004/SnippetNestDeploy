"use client";

import { showToast } from "@/lib";
import { GET_ME, LOGIN_USER, REGISTER_USER } from "@/lib/services";
import { useAppDispatch } from "@/redux/redux-hooks";
import { setUser } from "@/redux/slice/userSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import Image from "next/image";
import { useState } from "react";

interface FormDataType {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export default function LoginRegister({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("/user_logo.png");
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataType>({});

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    const NewformData = new FormData();
    NewformData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: NewformData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // here login image is not uploading to cloudinary ... so i have to check it
      setFormData({ ...formData, avatar: data.secure_url });
      setAvatarUrl(data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);
  const [GetMe] = useLazyQuery(GET_ME);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      try {
        const response = await registerUser({
          variables: {
            username: formData.username!,
            email: formData.email!,
            password: formData.password!,
            avatar: formData.avatar || avatarUrl || "/user_logo.png",
          },
        });

        if (response.data.registerUser.success) {
          showToast("Registration successful!", "success");
          const user = response.data.registerUser.user;
          dispatch(
            setUser({
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user?.avatar || "/user_logo.png",
              },
              isAdmin: user.role === "ADMIN",
            })
          );
        } else {
          alert(response.data.registerUser.message);
        }
      } catch (err) {
        console.error("Registration Error:", err);
      }
    } else {
      try {
        const res = await loginUser({
          variables: {
            username: formData.username!,
            password: formData.password!,
          },
        });
        if (res.data.loginUser.success) {
          showToast(res.data.loginUser.message, "success");

          try {
            const { data } = await GetMe();
            if (data.GetMe.success) {
              const user = data.GetMe.user;
              dispatch(
                setUser({
                  user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user?.avatar || "/user_logo.png",
                  },
                  isAdmin: user?.role === "ADMIN",
                })
              );
            } else {
              console.log("Unable to fetch current user");
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log("Login Failed");
        }
      } catch (error) {
        console.error(error);
      }
    }
    handleClose();
  };

  return (
    <div className="flex  bg-gray-100 h-[75vh] w-[50vw]">
      <aside className="hidden  lg:flex w-[25vw] ">
        <Image
          className="w-full h-full object-fill "
          src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2070&auto=format&fit=crop"
          alt="Login Illustration"
          width={300}
          height={500}
        />
      </aside>

      {/* Form Container */}
      <main className="flex flex-col justify-start items-center w-full md:w-1/2 p-8 bg-white shadow-lg ">
        <h2 className="text-2xl w-full text-center  font-bold mb-6 text-gray-800">
          <p className="pb-2">{isRegister ? "Create an account" : "Sign In"}</p>
          <hr />
        </h2>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          {/* Avatar Upload & Preview */}
          {isRegister && (
            <div className="flex flex-col items-center">
              <label className="mt-2 cursor-pointer text-blue-600 hover:underline">
                {avatarUrl && (
                  <Image
                    src={avatarUrl}
                    alt="Avatar Preview"
                    className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-md"
                    width={200}
                    height={200}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          {isRegister && (
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Switch between Login/Register */}
        <p className="mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </main>
    </div>
  );
}
