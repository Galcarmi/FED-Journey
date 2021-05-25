import express from 'express';

export type IDigestedRequest = express.Request & { userId: string };
