export type AggressionDb = {
    description: string,
    id: number
}

export enum AggressionLevel {
    VERY_FRIENDLY = 1,
    FRIENDLY,
    NEUTRAL,
    AGGRESSIVE,
    VERY_AGGRESSIVE
}