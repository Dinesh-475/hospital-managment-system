declare module 'node-gost-crypto' {
  export const gostEngine: {
    getGostDigest: (alg: any) => any;
  };
  export interface GostDigest {
    sign: (key: Uint8Array, message: Uint8Array) => any;
  }
  export interface AlgorithmIndentifier {
    mode: string;
    name: string;
    version: number;
    length: number;
  }
}
