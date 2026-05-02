import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => ID)
  categoryId: number;
}
