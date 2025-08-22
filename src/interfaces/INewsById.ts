import type { IBaseFileDTO } from './IBaseFileDTO';

export interface INewsById {
    id: string;
    title: string;
    content: string;
    type: number;
    createdAt: string;
    updatedAt?: string;
    files: IBaseFileDTO[];
}
