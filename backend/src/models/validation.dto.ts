import { IsNotEmpty, IsString } from 'class-validator';

export class ProposalCreateDto {
  @IsNotEmpty() @IsString() school!: String;
  @IsNotEmpty() @IsString() name!: String;
  @IsString() logo!: String;
  @IsNotEmpty() group!: Number;
}

export class EnableVotesDto {
    @IsNotEmpty() group!: Number;
}