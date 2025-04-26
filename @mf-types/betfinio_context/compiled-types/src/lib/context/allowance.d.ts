import { type FC, type PropsWithChildren } from 'react';
import type { Address } from 'viem';
type State = 'allowance' | 'transaction' | 'result';
type RequestType = 'stake' | 'bet';
interface AllowanceContextProps {
    requestAllowance?: (type: RequestType, amount: bigint) => void;
    state?: State;
    type?: RequestType;
    amount?: bigint;
    requested?: boolean;
    setResult?: (data: Address) => void;
}
export declare const AllowanceProvider: FC<PropsWithChildren>;
export declare const useAllowanceModal: () => AllowanceContextProps;
export {};
