# base58-monero

[![Build](https://github.com/CoinSpace/base58-monero/actions/workflows/ci.yml/badge.svg)](https://github.com/CoinSpace/base58-monero/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dm/base58-monero)](https://www.npmjs.com/package/base58-monero)
[![Version](https://img.shields.io/npm/v/base58-monero?label=version)](https://www.npmjs.com/package/base58-monero)
[![License](https://img.shields.io/github/license/CoinSpace/base58-monero?color=blue)](https://github.com/CoinSpace/base58-monero/blob/master/LICENSE)

Base58 Monero style.

## Base58 in Monero

Monero has its own variant of Base58.

In Monero the Base58 encoding is performed in 8-byte blocks, except the last block which is the remaining (8 or less) bytes.

The 8-byte block converts to 11 or less Base58 characters. If the block converted to less then 11 characters, the output is padded with "1"s (0 in Base58). The final block is padded as well to whatever would be the maximum size of this number of bytes encoded in Base58.

The advantage of Monero implementation is that output is of a fixed size which is not the case with plain Base58. The disadvantage is that default libraries won't work.

# Install

```
npm i --save base58-monero
```

## API

### encode(buffer: Buffer | Uint8Array)

Encode `Buffer` or `Uint8Array` as base58 `string`.

### decode(str: string)

Decode base58 `string` to `Buffer`.

## More

* [reference C++ Base58 implementation](https://github.com/monero-project/monero/blob/master/src/common/base58.cpp)

## Credits

[Coin Crypto Wallet](https://github.com/CoinSpace).

## License

MIT
