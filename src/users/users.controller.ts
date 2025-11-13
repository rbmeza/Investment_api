import { Controller, Body, Patch, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
// Aplica protección JWT a todas las rutas de este controlador
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
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // La lógica iría aquí, llamando al service
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * Ruta de ejemplo para obtener los datos del usuario logueado
   * GET /users/me
   */
  @Get('me')
  getMe(
    @GetUser() user: any,
  ) {
    // La información del usuario autenticado (sin password) se encuentra en 'user'
    return user; 
  }
}