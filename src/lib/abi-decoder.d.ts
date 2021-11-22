declare module 'abi-decoder' {
  function addABI(abiArray: any): void
  function decodeLogs(logs: any): any[]
}