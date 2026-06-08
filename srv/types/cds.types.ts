export type SpacefarerRequest = {
    data: unknown;
    user: {
        id: string;
        roles?: string[];
        attr?: {
            originPlanet?: string;
        };
    };
    error: (code: number, message: string) => void;
    warn: (code: number, message: string) => void;
    notify: (code: number, message: string) => void;
    query: {
        where(condition: object): void;
    };
    event: string;
    headers: Record<string, string>;
    params: unknown[];
}