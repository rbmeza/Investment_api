import { Controller, Body, Patch, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateValidationPipe } from '../common/pipes/update-validation.pipe';

const USER_UPDATE_ALLOWED_FIELDS = ['firstName', 'lastName'];

@Controller('users')
@UseGuards(AuthGuard('jwt')) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Requisito: Edita información personal del usuario
   * PATCH /users/me
   */
  @Patch('me')
  update(
    @GetUser('userId') userId: number,
    @Body(new UpdateValidationPipe(USER_UPDATE_ALLOWED_FIELDS)) 
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto as unknown as Record<string, any>);
  }

  /**
   * Ruta de ejemplo para obtener los datos del usuario logueado
   * GET /users/me
   */
  @Get('me')
  getMe(
    @GetUser() user: any,
  ) {
    return user; 
  }
}