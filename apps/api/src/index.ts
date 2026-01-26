import "dotenv/config";
import express from "express";
import { config } from "./config";
import { z } from "zod";
import { error } from "node:console";
import { prisma } from "@taskforge/db";
import type { Prisma } from"@prisma/client";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req: Request, res: Response) =>{
    res.status(200).json({status: "ok"});
});

const jsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ])
);

const createJobSchema = z.object({
    type: z.string().min(1, {message: "Type is required"}),
    payload: z.record(z.string(),jsonValue),
    maxRetries: z.coerce.number().int().nonnegative().default(10),
});


app.post("/jobs", async (req,res)=>{
    const parseResult = createJobSchema.safeParse(req.body);
    
    if (!parseResult.success){
        return res.status(400).json({
            error: "Invalid request body",
            details: z.treeifyError(parseResult.error),
        });
    }

    const { type, payload, maxRetries } = parseResult.data;
    const now = new Date();

    const job = await prisma.job.create({
        data: {
            type: type,
            payload: payload as Prisma.InputJsonValue,
            status: "CREATED",
            statusUpdatedAt: now,
            retryCount: 0,
            maxRetries
        }
    });

    return res.status(201).json({
        id : job.id,
        status: job.status,
        createdAt : job.createdAt,
    });
});

app.listen(config.port, ()=>{
    console.log(`API server listening on port ${config.port}`);
});