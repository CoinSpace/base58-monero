/* eslint-disable camelcase */
import '@jest/globals';
import {
  encode,
  decode,
} from './index.js';

// https://github.com/monero-project/monero/blob/v0.17.1.9/tests/unit_tests/base58.cpp#L168-L206

function TEST_encode_block(_block, expected) {
  const block = Buffer.from(_block, 'hex');

  test(`encode single block '${_block}' to base58 '${expected}'`, () => {
    const enc = encode(block);
    expect(enc).toBe(expected);
    const dec = decode(enc);
    expect(dec.equals(block)).toBe(true);
  });
}

TEST_encode_block('00', '11');
TEST_encode_block('39', '1z');
TEST_encode_block('FF', '5Q');

TEST_encode_block('0000', '111');
TEST_encode_block('0039', '11z');
TEST_encode_block('0100', '15R');
TEST_encode_block('FFFF', 'LUv');

TEST_encode_block('000000', '11111');
TEST_encode_block('000039', '1111z');
TEST_encode_block('010000', '11LUw');
TEST_encode_block('FFFFFF', '2UzHL');

TEST_encode_block('00000039', '11111z');
TEST_encode_block('FFFFFFFF', '7YXq9G');
TEST_encode_block('0000000039', '111111z');
TEST_encode_block('FFFFFFFFFF', 'VtB5VXc');
TEST_encode_block('000000000039', '11111111z');
TEST_encode_block('FFFFFFFFFFFF', '3CUsUpv9t');
TEST_encode_block('00000000000039', '111111111z');
TEST_encode_block('FFFFFFFFFFFFFF', 'Ahg1opVcGW');
TEST_encode_block('0000000000000039', '1111111111z');
TEST_encode_block('FFFFFFFFFFFFFFFF', 'jpXCZedGfVQ');

TEST_encode_block('0000000000000000', '11111111111');
TEST_encode_block('0000000000000001', '11111111112');
TEST_encode_block('0000000000000008', '11111111119');
TEST_encode_block('0000000000000009', '1111111111A');
TEST_encode_block('000000000000003A', '11111111121');
TEST_encode_block('00FFFFFFFFFFFFFF', '1Ahg1opVcGW');
TEST_encode_block('06156013762879F7', '22222222222');
TEST_encode_block('05E022BA374B2A00', '1z111111111');

// https://github.com/monero-project/monero/blob/v0.17.1.9/tests/unit_tests/base58.cpp#L209-L277

function TEST_decode_block_pos(enc, _expected) {
  const expected = Buffer.from(_expected, 'hex');

  test(`decode single block base58 '${enc}' to hex '${_expected}'`, () => {
    const dec = decode(enc);
    expect(dec.equals(expected)).toBe(true);
  });
}

function TEST_decode_block_neg(enc, err) {
  test(`decode single block '${enc}' throw error '${err}'`, () => {
    expect(() => {
      decode(enc);
    }).toThrow(err);
  });
}

// 1-byte block
TEST_decode_block_neg('1', 'Invalid encoded length');
TEST_decode_block_neg('z', 'Invalid encoded length');
// 2-bytes block
TEST_decode_block_pos('11', '00');
TEST_decode_block_pos('5Q', 'FF');
TEST_decode_block_neg('5R', 'Overflow');
TEST_decode_block_neg('zz', 'Overflow');
// 3-bytes block
TEST_decode_block_pos('111', '0000');
TEST_decode_block_pos('LUv', 'FFFF');
TEST_decode_block_neg('LUw', 'Overflow');
TEST_decode_block_neg('zzz', 'Overflow');
// 4-bytes block
TEST_decode_block_neg('1111', 'Invalid encoded length');
TEST_decode_block_neg('zzzz', 'Invalid encoded length');
// 5-bytes block
TEST_decode_block_pos('11111', '000000');
TEST_decode_block_pos('2UzHL', 'FFFFFF');
TEST_decode_block_neg('2UzHM', 'Overflow');
TEST_decode_block_neg('zzzzz', 'Overflow');
// 6-bytes block
TEST_decode_block_pos('111111', '00000000');
TEST_decode_block_pos('7YXq9G', 'FFFFFFFF');
TEST_decode_block_neg('7YXq9H', 'Overflow');
TEST_decode_block_neg('zzzzzz', 'Overflow');
// 7-bytes block
TEST_decode_block_pos('1111111', '0000000000');
TEST_decode_block_pos('VtB5VXc', 'FFFFFFFFFF');
TEST_decode_block_neg('VtB5VXd', 'Overflow');
TEST_decode_block_neg('zzzzzzz', 'Overflow');
// 8-bytes block
TEST_decode_block_neg('11111111', 'Invalid encoded length');
TEST_decode_block_neg('zzzzzzzz', 'Invalid encoded length');
// 9-bytes block
TEST_decode_block_pos('111111111', '000000000000');
TEST_decode_block_pos('3CUsUpv9t', 'FFFFFFFFFFFF');
TEST_decode_block_neg('3CUsUpv9u', 'Overflow');
TEST_decode_block_neg('4CUsUpv9t', 'Overflow');
TEST_decode_block_neg('3CUtUpv9t', 'Overflow');
TEST_decode_block_neg('zzzzzzzzz', 'Overflow');
// 10-bytes block
TEST_decode_block_pos('1111111111', '00000000000000');
TEST_decode_block_pos('Ahg1opVcGW', 'FFFFFFFFFFFFFF');
TEST_decode_block_neg('Ahg1opVcGX', 'Overflow');
TEST_decode_block_neg('zzzzzzzzzz', 'Overflow');
// 11-bytes block
TEST_decode_block_pos('11111111111', '0000000000000000');
TEST_decode_block_pos('jpXCZedGfVQ', 'FFFFFFFFFFFFFFFF');
TEST_decode_block_neg('jpXCZedGfVR', 'Overflow');
TEST_decode_block_neg('zzzzzzzzzzz', 'Overflow');
// Invalid symbols
TEST_decode_block_neg('01111111111', 'Invalid symbol');
TEST_decode_block_neg('11111111110', 'Invalid symbol');
TEST_decode_block_neg('11111011111', 'Invalid symbol');
TEST_decode_block_neg('I1111111111', 'Invalid symbol');
TEST_decode_block_neg('O1111111111', 'Invalid symbol');
TEST_decode_block_neg('l1111111111', 'Invalid symbol');
TEST_decode_block_neg('_1111111111', 'Invalid symbol');

// https://github.com/monero-project/monero/blob/v0.17.1.9/tests/unit_tests/base58.cpp#L280-L302

function TEST_encode(expected, _data) {
  const data = Buffer.from(_data, 'hex');
  test(`encode hex ${_data} to base58 '${expected}'`, () => {
    const enc = encode(data);
    expect(enc).toBe(expected);
    const dec = decode(enc);
    expect(dec.equals(data)).toBe(true);
  });
}

TEST_encode('11', '00');
TEST_encode('111', '0000');
TEST_encode('11111', '000000');
TEST_encode('111111', '00000000');
TEST_encode('1111111', '0000000000');
TEST_encode('111111111', '000000000000');
TEST_encode('1111111111', '00000000000000');
TEST_encode('11111111111', '0000000000000000');
TEST_encode('1111111111111', '000000000000000000');
TEST_encode('11111111111111', '00000000000000000000');
TEST_encode('1111111111111111', '0000000000000000000000');
TEST_encode('11111111111111111', '000000000000000000000000');
TEST_encode('111111111111111111', '00000000000000000000000000');
TEST_encode('11111111111111111111', '0000000000000000000000000000');
TEST_encode('111111111111111111111', '000000000000000000000000000000');
TEST_encode('1111111111111111111111', '00000000000000000000000000000000');
TEST_encode('22222222222VtB5VXc', '06156013762879F7FFFFFFFFFF');

// https://github.com/monero-project/monero/blob/v0.17.1.9/tests/unit_tests/base58.cpp#L305-L392

function TEST_decode_pos(enc, _expected) {
  const expected = Buffer.from(_expected, 'hex');

  test(`decode base58 '${enc}' to hex '${_expected}'`, () => {
    const dec = decode(enc);
    expect(dec.equals(expected)).toBe(true);
  });
}

function TEST_decode_neg(enc, err) {
  test(`decode '${enc}' throw error '${err}'`, () => {
    expect(() => {
      decode(enc);
    }).toThrow(err);
  });
}

TEST_decode_pos('', '');
TEST_decode_pos('5Q', 'FF');
TEST_decode_pos('LUv', 'FFFF');
TEST_decode_pos('2UzHL', 'FFFFFF');
TEST_decode_pos('7YXq9G', 'FFFFFFFF');
TEST_decode_pos('VtB5VXc', 'FFFFFFFFFF');
TEST_decode_pos('3CUsUpv9t', 'FFFFFFFFFFFF');
TEST_decode_pos('Ahg1opVcGW', 'FFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQ', 'FFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQ5Q', 'FFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQLUv', 'FFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQ2UzHL', 'FFFFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQ7YXq9G', 'FFFFFFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQVtB5VXc', 'FFFFFFFFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQ3CUsUpv9t', 'FFFFFFFFFFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQAhg1opVcGW', 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
TEST_decode_pos('jpXCZedGfVQjpXCZedGfVQ', 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
// Invalid length
TEST_decode_neg('1', 'Invalid encoded length');
TEST_decode_neg('z', 'Invalid encoded length');
TEST_decode_neg('1111', 'Invalid encoded length');
TEST_decode_neg('zzzz', 'Invalid encoded length');
TEST_decode_neg('11111111', 'Invalid encoded length');
TEST_decode_neg('zzzzzzzz', 'Invalid encoded length');
TEST_decode_neg('123456789AB1', 'Invalid encoded length');
TEST_decode_neg('123456789ABz', 'Invalid encoded length');
TEST_decode_neg('123456789AB1111', 'Invalid encoded length');
TEST_decode_neg('123456789ABzzzz', 'Invalid encoded length');
TEST_decode_neg('123456789AB11111111', 'Invalid encoded length');
TEST_decode_neg('123456789ABzzzzzzzz', 'Invalid encoded length');
// Overflow
TEST_decode_neg('5R', 'Overflow');
TEST_decode_neg('zz', 'Overflow');
TEST_decode_neg('LUw', 'Overflow');
TEST_decode_neg('zzz', 'Overflow');
TEST_decode_neg('2UzHM', 'Overflow');
TEST_decode_neg('zzzzz', 'Overflow');
TEST_decode_neg('7YXq9H', 'Overflow');
TEST_decode_neg('zzzzzz', 'Overflow');
TEST_decode_neg('VtB5VXd', 'Overflow');
TEST_decode_neg('zzzzzzz', 'Overflow');
TEST_decode_neg('3CUsUpv9u', 'Overflow');
TEST_decode_neg('zzzzzzzzz', 'Overflow');
TEST_decode_neg('Ahg1opVcGX', 'Overflow');
TEST_decode_neg('zzzzzzzzzz', 'Overflow');
TEST_decode_neg('jpXCZedGfVR', 'Overflow');
TEST_decode_neg('zzzzzzzzzzz', 'Overflow');
TEST_decode_neg('123456789AB5R', 'Overflow');
TEST_decode_neg('123456789ABzz', 'Overflow');
TEST_decode_neg('123456789ABLUw', 'Overflow');
TEST_decode_neg('123456789ABzzz', 'Overflow');
TEST_decode_neg('123456789AB2UzHM', 'Overflow');
TEST_decode_neg('123456789ABzzzzz', 'Overflow');
TEST_decode_neg('123456789AB7YXq9H', 'Overflow');
TEST_decode_neg('123456789ABzzzzzz', 'Overflow');
TEST_decode_neg('123456789ABVtB5VXd', 'Overflow');
TEST_decode_neg('123456789ABzzzzzzz', 'Overflow');
TEST_decode_neg('123456789AB3CUsUpv9u', 'Overflow');
TEST_decode_neg('123456789ABzzzzzzzzz', 'Overflow');
TEST_decode_neg('123456789ABAhg1opVcGX', 'Overflow');
TEST_decode_neg('123456789ABzzzzzzzzzz', 'Overflow');
TEST_decode_neg('123456789ABjpXCZedGfVR', 'Overflow');
TEST_decode_neg('123456789ABzzzzzzzzzzz', 'Overflow');
TEST_decode_neg('zzzzzzzzzzz11', 'Overflow');
// Invalid symbols
TEST_decode_neg('10', 'Invalid symbol');
TEST_decode_neg('11I', 'Invalid symbol');
TEST_decode_neg('11O11', 'Invalid symbol');
TEST_decode_neg('11l111', 'Invalid symbol');
TEST_decode_neg('11_11111111', 'Invalid symbol');
TEST_decode_neg('1101111111111', 'Invalid symbol');
TEST_decode_neg('11I11111111111111', 'Invalid symbol');
TEST_decode_neg('11O1111111111111111111', 'Invalid symbol');
TEST_decode_neg('1111111111110', 'Invalid symbol');
TEST_decode_neg('111111111111l1111', 'Invalid symbol');
TEST_decode_neg('111111111111_111111111', 'Invalid symbol');
