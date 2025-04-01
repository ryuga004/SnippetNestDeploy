import React from "react";

const AuthorizedRoute = () => {
  return <div>AuthorizedRoutesOnly</div>;
};

export default AuthorizedRoute;

// "use client";

// import { useAppSelector } from "@/redux/redux-hooks";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const withAuth = (WrappedComponent: React.ComponentType) => {
//     return function AuthComponent(props: any) {
//         const router = useRouter();
//         const { isLoggedIn, isAdmin } = useAppSelector((state) => state.user);

//         useEffect(() => {
//             if (!isLoggedIn) {
//                 router.replace("/");
//             } else if (!isAdmin) {
//                 router.replace("/");
//             }
//         }, [router, isLoggedIn, isAdmin]);

//         if (!isLoggedIn) return null;

//         return <WrappedComponent {...props} />;
//     };
// };

// export default withAuth;
