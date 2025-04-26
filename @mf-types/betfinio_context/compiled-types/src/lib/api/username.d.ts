import type { SupabaseClient } from '@supabase/supabase-js';
import type { Address } from 'viem';
export declare const fetchUsername: (member: Address, supabase?: SupabaseClient, user?: Address) => Promise<string>;
export declare const fetchCustomUsername: (address: Address | undefined, user: Address | undefined, supabase: SupabaseClient | undefined) => Promise<"" | undefined>;
export declare const saveUsername: (username: string, me: Address, sign: any, supabase?: SupabaseClient) => Promise<boolean>;
export declare const saveCustomUsername: (username: string, address: Address, user: Address, sign: any, supabase?: SupabaseClient) => Promise<boolean>;
