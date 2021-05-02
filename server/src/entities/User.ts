import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";


// to make the class a graghql type to use it as return type for Query()
// we can unexpose a specific field by removing @Field decorator
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;
  
  @Field(() => String)
  @Property({type: 'date'})
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({type: 'text', unique: true})
  username!: string;

  @Field()
  @Property({type: 'text', unique: true})
  email!: string;

  @Property({type: 'text'})
  password!: string;

}