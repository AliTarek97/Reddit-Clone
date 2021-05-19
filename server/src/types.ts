import { Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
    req: any;
    res: Response;
    redis: Redis;
}