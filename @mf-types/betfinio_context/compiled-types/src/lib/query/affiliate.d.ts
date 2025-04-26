import type { LinearData, TreeMember } from '@/src/lib/types';
import type { Address } from 'viem';
export declare const useTreeMember: (address: Address) => import("@tanstack/react-query").UseQueryResult<TreeMember, Error>;
export declare const useInviteStakingVolume: (member: Address) => import("@tanstack/react-query").UseQueryResult<bigint, Error>;
export declare const useInviteBettingVolume: (member: Address) => import("@tanstack/react-query").UseQueryResult<bigint, Error>;
export declare const useInviteCondition: () => import("@tanstack/react-query").UseQueryResult<bigint, Error>;
export declare const useLinearData: (member: Address) => import("@tanstack/react-query").UseQueryResult<LinearData | null, Error>;
export declare const useMemberLinearStructure: (member: Address) => import("@tanstack/react-query").UseQueryResult<TreeMember | null, Error>;
export declare const useDirectInviteesCount: (address: Address) => import("@tanstack/react-query").UseQueryResult<number, Error>;
