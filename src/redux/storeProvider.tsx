"use client";
import { AppStore, makeStore } from "@/redux/store";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { fetchProblems } from "./slice/problemSlice";
import { fetchSnippets } from "./slice/snippetSlice";
import { fetchUser } from "./slice/userSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    storeRef.current?.dispatch(fetchSnippets());
    storeRef.current?.dispatch(fetchProblems());
    storeRef.current?.dispatch(fetchUser());
  }, []);

  return <Provider store={storeRef?.current}>{children}</Provider>;
}
