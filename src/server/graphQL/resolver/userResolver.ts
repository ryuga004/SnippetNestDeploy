import { deleteUser, getAllUsers, GetMe, getUserById, loginUser, logoutUser, registerUser, updateUser } from "@/server/controllers/user";
import prisma from "@/server/prisma";
import { Context } from "@apollo/client";

export const userResolvers = {
    Query: {
        getAllUsers,
        GetMe,
        getUserById,
        getLeaderBoardUsers : async () => {
            try {

                const users = await prisma.user.findMany({
                    orderBy: {
                        points: "desc",
                    },
                    include : {
                        stats : true ,
                    }
                });

                if (users) {
                    await Promise.all(users.map(async (user, index) => {
                        const stats = await prisma.stats.findUnique({
                            where: { userId: user.id },
                        });
                        if (!stats) {
                            await prisma.stats.create({
                                data: {
                                    userId: user.id,
                                    rank: index + 1,
                                },
                            });
                        } else {
                            await prisma.stats.update({
                                where: { userId: user.id },
                                data: {
                                    ...stats,
                                    rank: index + 1,
                                },
                            });
                        }
                    }));
                }

                return {
                    success: true,
                    message: "Users fetched successfully",
                    users,
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                    message: "Something went wrong",
                    users: null,
                };
            }
        }
    },
    Mutation: {
        deleteUser,
        logoutUser,
        registerUser,
        loginUser,
        updateUser,
        updateUserSocial : async (_:unknown , {input} : { input : {
            github : string ,
            linkedin : string,
            twitter : string 
        } } , context: Context)=>{
            try {
              
                if (!context.user) {
                    return {
                        success: false,
                        message: "Unauthorized",
                        social: null,
                    };
                }
        
               
                const existingSocial = await prisma.social.findUnique({
                    where: { userId: context.user.id },
                });
        
                if (!existingSocial) {
                   
                    const newSocial = await prisma.social.create({
                        data: {
                            ...input ,
                            userId : context.user.id 
                        },
                    });
        
                    return {
                        success: true,
                        message: "Social profile created successfully",
                        social: newSocial,
                    };
                }
        
               
                const updatedSocial = await prisma.social.update({
                    where: { userId: context.user.id },
                    data: input,
                });
        
                return {
                    success: true,
                    message: "Social profile updated successfully",
                    social: updatedSocial,
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                    message: "Something went wrong",
                    social: null,
                };
            }
        }
    },
};