import { type toast as toastRef } from '@betfinio/components/ui';
import type { FC } from 'react';
declare const CreateLinkModal: FC<{
    toast: typeof toastRef;
    parent: number;
    side?: 'L' | 'R';
    open: boolean;
    handleOpenChange: (status: boolean) => void;
}>;
export default CreateLinkModal;
