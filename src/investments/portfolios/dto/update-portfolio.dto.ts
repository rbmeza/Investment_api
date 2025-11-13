import { IsString, IsOptional } from 'class-validator';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  targetAllocation?: string;
}