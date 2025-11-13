import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador personalizado para obtener el usuario autenticado.
 * Puede ser usado como:
 * @GetUser() user: UserData // Obtiene todo el objeto de usuario (userId, email, firstName)
 * @GetUser('userId') userId: number // Obtiene solo el ID del usuario
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // 1. Obtenemos el objeto de solicitud HTTP
    const request = ctx.switchToHttp().getRequest();
    // 2. El objeto 'user' es el que devolvió nuestro JwtStrategy.validate()
    const user = request.user; 

    // 3. Si se especifica un campo (ej: 'userId'), lo devolvemos.
    if (data) {
      return user[data];
    }
    
    // 4. Si no se especifica ningún campo, devolvemos el objeto completo.
    return user;
  },
);