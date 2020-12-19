export {};

declare global {
  interface Array<T> {
    contains(obj: T): boolean;
    contains(
      pred: (this: void, value: any, index: number, obj: any[]) => boolean
    ): boolean;
  }
}
