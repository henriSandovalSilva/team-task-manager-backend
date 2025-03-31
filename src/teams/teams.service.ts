import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

type TeamWithMembership = Team & { isMember: boolean };

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private usersService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto, creator: User): Promise<Team> {
    const team = this.teamsRepository.create({
      ...createTeamDto,
      createdBy: creator,
      users: [creator],
    });

    return this.teamsRepository.save(team);
  }

  async findAll(userId: string): Promise<TeamWithMembership[]> {
    const teams = await this.teamsRepository.find({
      relations: ['users', 'createdBy', 'tasks'],
      order: {
        createdAt: 'DESC',
      },
    });

    return teams.map((team) => ({
      ...team,
      isMember: team.users.some((user) => user.id === userId),
    }));
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['users', 'tasks'],
    });

    if (!team) throw new NotFoundException('Time não encontrado');
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return this.teamsRepository.save(team);
  }

  async remove(id: string, userId: string): Promise<void> {
    const team = await this.findOne(id);

    if (team.createdBy.id !== userId) {
      throw new ForbiddenException('Somente o criador do time pode excluí-lo.');
    }

    await this.teamsRepository.remove(team);
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.findOne(teamId);
    const user = await this.usersService.findOne(userId);

    if (!team.users) {
      team.users = [];
    }

    const isAlreadyAssociated = team.users.some((u) => u.id === userId);

    if (isAlreadyAssociated) {
      throw new BadRequestException('Usuário já está associado ao time.');
    }

    team.users.push(user);
    return this.teamsRepository.save(team);
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.findOne(teamId);

    if (!team.users) {
      throw new BadRequestException('Este time não possui usuários associados.');
    }

    const isAssociated = team.users.some((u) => u.id === userId);

    if (!isAssociated) {
      throw new BadRequestException('Usuário não está associado ao time.');
    }

    team.users = team.users.filter((user) => user.id !== userId);

    return this.teamsRepository.save(team);
  }
}
