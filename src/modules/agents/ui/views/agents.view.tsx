"use clients"

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/clients";

export const AgentsView = () => {
const trpc = useTRPC();
const { data, isLoading } = useQuery(trpc.agents.gtMany.queryOptions());
return (
    <div>
        {JSON.stringify(data, null, 2)}
    </div>
)
}