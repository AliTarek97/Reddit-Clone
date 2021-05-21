import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from 'express-session';
import Redis from 'ioredis';
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";


const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'postgres123',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });
    
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();


    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            saveUninitialized: false,
            secret: 'ahasdhasdd',
            resave: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true, // for security reasons, in javascript code in my frontend I can't access the cookie
                sameSite: 'lax', // protecting csrf
                secure: __prod__, // cookie only works in https
            }
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ req, res, redis })
    })

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    })
    // // creating post instance
    // const post = orm.em.create(Post, {title: 'My first post'});
    // // add it to database
    // await orm.em.persistAndFlush(post);
}

main();
