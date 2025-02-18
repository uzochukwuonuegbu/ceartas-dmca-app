import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { SocialMediaAgentService } from '../../services/socialMediaAgent/socialMediaAgent.service';
import { ProcessAnalysisDto, RetrieveDataDto } from './dto/ProcessRequest.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('social-media-agent')
@Controller('social-media-agent')
export class SocialAgentController {
  constructor(private readonly socialMediaAgentService: SocialMediaAgentService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze social media data for a username' })
  @ApiBody({ type: ProcessAnalysisDto })
  @ApiResponse({ status: 200, description: 'Successfully processed request' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async analyze(
    @Body() payload: ProcessAnalysisDto
  ): Promise<{ username: string; data: any }> {
    return this.socialMediaAgentService.processRequest(payload, payload.clientId);
  }

  @Get('analysis')
  @ApiOperation({ summary: 'Retrieve analysis for a username' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async analysisByUsername(
    @Query() payload: RetrieveDataDto
  ): Promise<{ username: string; data: any }> {
    return this.socialMediaAgentService.retrieveData(payload);
  }
}