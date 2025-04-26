export declare const getLatestVersion: (repository: string, branch?: string) => Promise<string>;
export declare const useLatestVersion: (repository: string, branch?: string) => import("@tanstack/react-query").UseQueryResult<string, Error>;
