import { z } from "zod"

const envSchema = z.object({
    PORT: z.coerce.number().int().positive(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success){
    console.error("Invalid environment configuration: ");
    console.error(z.treeifyError(parsedEnv.error));
    process.exit(1);
}

export const config = {
    port : parsedEnv.data.PORT,
}
