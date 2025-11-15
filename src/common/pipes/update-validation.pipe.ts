import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isObject } from 'class-validator';

@Injectable()
export class UpdateValidationPipe implements PipeTransform {
  // Los campos permitidos se pasan al constructor del Pipe
  constructor(private readonly allowedFields: string[]) {}

  transform(value: any) {
    if (!isObject(value)) {
      throw new BadRequestException('Formato de datos de actualización inválido.');
    }

    const receivedFields = Object.keys(value);

    // 1. Validar campos no permitidos
    const invalidFields = receivedFields.filter(
      field => !this.allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Campos no permitidos para actualización: ${invalidFields.join(', ')}. ` +
        `Solo se permiten: ${this.allowedFields.join(', ')}`
      );
    }

    // 2. Filtrar solo los campos permitidos y omitir los campos undefined/null
    const dataToUpdate = this.allowedFields.reduce((acc, key) => {
      // Usamos 'in value' para asegurar que la clave exista en el DTO recibido
      if (key in value && value[key] !== undefined && value[key] !== null) {
        acc[key] = value[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // 3. Validar que al menos un campo sea proporcionado
    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un campo válido para actualizar');
    }

    return dataToUpdate;
  }
}