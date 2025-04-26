import { type FC, type PropsWithChildren } from 'react';
interface ChatbotContextProps {
    minimize: () => void;
    maximize: () => void;
    toggle: () => void;
}
export declare const ChatbotProvider: FC<PropsWithChildren>;
export declare const useChatbot: () => ChatbotContextProps;
export {};
