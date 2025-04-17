import { type ReactNode } from 'react';
type ToSContextValue = {
    showToSModal: (onConfirm: () => void) => void;
};
export declare const ToSProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useToSContext: () => ToSContextValue;
export declare function useWithTOS(): {
    withTOS: (callback: () => void) => void;
};
export {};
