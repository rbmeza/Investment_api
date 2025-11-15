import { Controller, Post, Body, UseGuards, Get, Query, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovementsService } from './movements.service';
import { RegisterMovementDto } from './dto/register-movement.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('investments/movements')
@UseGuards(AuthGuard('jwt')) 
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  /**
   * Requisito: Registrar un depósito/retiro (POST /investments/movements)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(
    @GetUser('userId') userId: number,
    @Body(ValidationPipe) registerMovementDto: RegisterMovementDto,
  ) {
    return this.movementsService.register(userId, registerMovementDto);
  }

  /**
   * Requisito: Consultar los últimos movimientos del usuario (GET /investments/movements)
   */
  @Get()
  findAll(
    @GetUser('userId') userId: number,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.movementsService.findLatest(userId, parsedLimit);
  }
}