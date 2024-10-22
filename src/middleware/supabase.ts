import { Context, MiddlewareHandler } from 'hono';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const idCtxSupabase = 'supabase-ctx';

export const supabaseMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        // Verifica que las variables de entorno estén definidas
        if (!c.env.SUPABASE_URL) {
            throw new Error('Debes declarar SUPABASE_URL como variable de entorno');
        }
        if (!c.env.SUPABASE_KEY) {
            throw new Error('Debes declarar SUPABASE_KEY como variable de entorno');
        }

        // Crea el cliente de Supabase
        const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY);
        // Almacena el cliente de Supabase en el contexto
        c.set(idCtxSupabase, supabase);

        // Continúa con el siguiente middleware
        await next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return c.text(`Error en el middleware de Supabase: ${errorMessage}`, 500);
    }
};

// Función para obtener el cliente de Supabase desde el contexto
export const getSupabase = (c: Context): SupabaseClient => {
    let supabase: any;
    // @ts-ignore
    supabase = c.get<SupabaseClient>(idCtxSupabase);
    if (!supabase) {
        throw new Error('Supabase no ha sido inicializado correctamente');
    }
    return supabase;
};