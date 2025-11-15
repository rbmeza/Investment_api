import { IsString, IsOptional } from 'class-validator';

export class UpdatePortfolioDto {
  @IsString()
  @IsOptional()
  name?: string;
}