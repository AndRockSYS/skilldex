'use server';

import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

export const getPlatform = async (): Promise<Buffer> => {
    return bs58.decode(process.env.ADMIN_PK as string);
};
