import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// Esquema de validación para el usuario
export const schemaUser = z.object({
    name: z.string().min(1, { message: 'El nombre es requerido' }), // El nombre no puede estar vacío
    email: z.string().email({ message: 'El correo electrónico debe ser válido' }), // Validación con mensaje personalizado
});

// Middleware para la validación de datos utilizando zod-validator
export const zUserValidator = zValidator('form', schemaUser);