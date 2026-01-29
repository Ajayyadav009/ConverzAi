"use client"

import { useTRPC } from "@/trpc/clients";
import { useQueries, useQuery } from "@tanstack/react-query";
import { text } from "stream/consumers";

export const HomeView = () => {
const trpc = useTRPC();
const { data } = useQuery(trpc.hello.queryOptions({ text: "Antonio"}));

  return (
  <div className="flex flex-col p-4 gap-y-4">
   {data?.greeting}
  </div>  
  );
 }


