import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";


// to make the class a graghql type to use it as return type for Query()
// we can unexpose a specific field by removing @Field decorator
@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;
  
  
  @Field()
  @Column({unique: true})
  username!: string;
  
  @Field()
  @Column({unique: true})
  email!: string;
  
  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[]
  
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}