import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProcessAnalysisDto {
  @ApiProperty({ example: 'elonmusk', description: 'Username to analyze' })
  @IsString()
    username: string;

  @ApiProperty({ example: 'swd4e6hsdf', description: 'Client ID' })
  @IsOptional()
  @IsString()
    clientId: string;
  }

export class RetrieveDataDto {
    @ApiProperty({ example: 'elonmusk', description: 'Username to analyze' })
    @IsString()
      username: string;
    }