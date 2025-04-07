
export interface IBoxValue {
    value: number;
    image?: string;
}

export enum BingoType {
    "normal" = "normal",
    "free" = "free"
}

export enum StatusRoundBingo {
    active = "active",
    finished = "finished"
}