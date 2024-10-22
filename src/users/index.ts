import { Hono } from 'hono';
import { zUserValidator } from './validator';
import { getSupabase, supabaseMiddleware } from '../middleware/supabase';

const appUser = new Hono();
appUser.use('*', supabaseMiddleware);

/**
 * Ruta para consultar los usuarios en Supabase
 */
appUser.get('/', async (c) => {
    const supabase = getSupabase(c);
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        return c.json({ message: 'Error al consultar los usuarios', error: error.message }, 500);
    }

    return c.json({ data }, 200);
});

/**
 * Ruta para registrar los usuarios en Supabase
 */
appUser.post('/', zUserValidator, async (c) => {
    try {
        const body = await c.req.parseBody();
        if (!body) {
            return c.json({ message: 'El cuerpo de la solicitud está vacío' }, 400);
        }

        const supabase = getSupabase(c);
        const { data, error } = await supabase.from('users').insert(body).select();

        if (error) {
            return c.json({ message: 'Error al registrar el usuario', error: error.message }, 500);
        }

        return c.json({ data }, 201);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return c.json({ message: 'Error al procesar la solicitud', error: errorMessage }, 500);
    }
});

export { appUser };