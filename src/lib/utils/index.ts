export * from "./format";
export * from "./validation";
export * from "./performance";
export * from "./constants";
export * from "./hooks";
export * from "./env";
export * from "./status";
export * from "./table";

// Common utility functions
export { cn } from "../utils";

// Type utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

// Common type guards
export const isNonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;