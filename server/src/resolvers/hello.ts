import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
    // we need to clear what our query returns so we pass 
    // the parameters below to Query
    @Query(() => String)
    hello() {
        return "hello";
    }
}