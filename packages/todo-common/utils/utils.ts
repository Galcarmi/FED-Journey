export const isTestEnv = (): boolean => !process.env.production
export const isE2E = (): boolean => process.env.E2E ? true : false;
