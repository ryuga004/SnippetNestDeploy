// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "../prisma";
// import { AuthenticatedRequest } from "../types/server_types";

// const SECRET = process.env.JWT_SECRET || "";

// export const isAuthenticatedUser = async (req: NextRequest, res: NextResponse) => {
//     try {
//         const token = req.cookies.get("auth")?.value;
//         if (!token) {
//             return new NextResponse(JSON.stringify({ error: "Please log in to access this" }), { status: 401 });
//         }

//         const decodedData = jwt.verify(token, SECRET) as { userId: string };
//         const currentUser = await prisma.user.findUnique({ where: { id: decodedData.userId } });

//         if (!currentUser) {
//             return new NextResponse(JSON.stringify({ error: "Error retrieving user" }), { status: 401 });
//         }

//         (req as AuthenticatedRequest).userId = currentUser.id;
//         return NextResponse.next();
//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: "Invalid authentication token" }), { status: 403 });
//     }
// };


// export const authorizeRoles = () => {
//     return async (req: NextRequest, res: NextResponse) => {
//         try {
//             const userId = (req as AuthenticatedRequest).userId;
//             const user = await prisma.user.findUnique({ where: { id: userId } });

//             if (!user) {
//                 return new NextResponse(JSON.stringify({ error: "Not logged in" }), { status: 403 });
//             }

//             if (user.role == "USER") {
//                 return new NextResponse(JSON.stringify({ error: `Role: ${user.role} is not authorized` }), { status: 403 });
//             }

//             return NextResponse.next();
//         } catch (error) {
//             return new NextResponse(JSON.stringify({ error: "Authorization failed" }), { status: 403 });
//         }
//     };
// };
