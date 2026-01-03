import type { d1 } from '$lib/server/db/d1';
import { local_db } from '$lib/server/db/local';

export type DBType = ReturnType<typeof d1> | ReturnType<typeof local_db>;