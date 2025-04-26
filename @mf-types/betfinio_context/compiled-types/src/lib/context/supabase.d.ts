import type { SupabaseClient } from '@supabase/supabase-js';
import { type FC, type PropsWithChildren } from 'react';
interface SupabaseContextProps {
    client: SupabaseClient | undefined;
}
export declare const SupabaseProvider: FC<PropsWithChildren<SupabaseContextProps>>;
export declare const useSupabase: () => SupabaseContextProps;
export {};
