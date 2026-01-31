import { db } from "@/database";
import { agents } from "@/database/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
    gtMany: baseProcedure.query(async () => {
        const data = await db
        .select()
        .from(agents);
        return  data
    })
})