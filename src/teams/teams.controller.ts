import { Controller, Post, Body, Get, Param, Patch, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.teamsService.remove(id, req.user.id);
  }

  @Post(':id/join')
  async joinTeam(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.teamsService.addUserToTeam(id, userId);
  }

  @Delete(':id/leave')
  async leaveTeam(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.teamsService.removeUserFromTeam(id, userId);
  } 
}
