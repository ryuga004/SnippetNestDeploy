import { deleteUser, getAllUsers, GetMe, getUserById, loginUser, logoutUser, registerUser, updateUser } from "@/server/controllers/user"

export const userResolvers = {
    Query: {
        getAllUsers,
        GetMe,
        getUserById,
    },
    Mutation: {
        deleteUser,
        logoutUser,
        registerUser,
        loginUser,
        updateUser,
    },
};