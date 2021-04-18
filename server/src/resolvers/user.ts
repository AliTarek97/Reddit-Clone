import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {

    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        return await em.findOne(User, req.session.userId);
    }
    // we need to clear what our query returns so we pass
    // the parameters below to Query
    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }

        if (options.password.length <= 2) {
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be greater than 2'
                }]
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        let user ;

        try {
            const result= await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                // we have to add createdAt & updatedAt because
                // we are using knewQuery (3:08:18)
                username: options.username,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date()
            }).returning('*');
            user = result[0];
        } catch (error) {
            //duplicate username error
            if(error.code === "23505" || error.detail.includes("already exists")){
                return {
                    errors:[{
                        field: 'username',
                        message: 'username already taken'
                    }]
                }
            }
        }

        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id;
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        // TODO try to handle the error from using Request instead of any
        req.session.userId = user.id;
        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ) {
        return new Promise(resolve => {
            req.session.destroy((err: any) => {
                // clear the cookie whether the cookie is 
                // destroyed or not from redis
                res.clearCookie(COOKIE_NAME);
                if(err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        })
        
    }
}
