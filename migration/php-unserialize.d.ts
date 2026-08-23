declare module 'php-unserialize' {
  export function unserialize(data: string): any
  export function serialize(data: any): string
}
