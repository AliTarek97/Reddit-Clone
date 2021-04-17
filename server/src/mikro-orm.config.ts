import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: 'lireddit',
    type:'postgresql',
    debug: !__prod__,
    user:'postgres',
    password: 'postgres123'
} as Parameters<typeof MikroORM.init>[0];

// Obtain the parameters of a MikroORM.init 
// and know the types It wants