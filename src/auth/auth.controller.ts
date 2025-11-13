import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Ruta POST /auth/register
   * Crea un nuevo usuario y su portafolio inicial.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // El servicio se encarga de hashear y guardar.
    return this.authService.register(registerDto);
  }

  /**
   * Ruta POST /auth/login
   * Autentica al usuario y devuelve un JWT.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // El servicio maneja la verificación de contraseña y la generación del token.
    return this.authService.login(loginDto);
    // Retorna: { access_token: '...' }
  }
}