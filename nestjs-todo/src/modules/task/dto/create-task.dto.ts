import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  userId!: number;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
