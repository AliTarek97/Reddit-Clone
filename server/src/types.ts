import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {  Response } from "express";

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: any;
    res: Response;
}