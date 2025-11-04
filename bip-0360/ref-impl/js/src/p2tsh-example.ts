// src/p2tsh-example.ts
// Example demonstrating P2TSH (Pay-to-Taproot-Script-Hash) address construction

import { payments } from '@jbride/bitcoinjs-lib';
import * as bscript from '@jbride/bitcoinjs-lib/src/script';
import type { Taptree } from '@jbride/bitcoinjs-lib/src/types';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { randomBytes } from 'crypto';

const { p2tsh } = payments;

// Initialize ECPair with the ECC library
const ECPair = ECPairFactory(ecc);

// Create a secure RNG function
const rng = (size: number) => randomBytes(size);

/**
 * Example 1: Construct a P2TSH address from a script tree with a single leaf
 * This is the simplest case - a script tree containing one script.
 */
function example1_simpleScriptTree() {
  console.log('=== Example 1: P2TSH from simple script tree ===');
  
  // Generate a key pair
  const keyPair = ECPair.makeRandom({ rng });
  const pubkey = keyPair.publicKey;
  
  // Compile the script: pubkey OP_CHECKSIG
  const script = bscript.compile([pubkey, bscript.OPS.OP_CHECKSIG]);
  
  // Create a script tree with one leaf
  const scriptTree = {
    output: script,
  };
  
  // Construct the P2TSH payment
  const payment = p2tsh({
    scriptTree: scriptTree,
  });
  
  console.log('Generated public key:', pubkey.toString('hex'));
  console.log('Script tree:', { output: bscript.toASM(script) });
  console.log('P2TSH Address:', payment.address);
  console.log('Output script:', bscript.toASM(payment.output!));
  console.log('Merkle root hash:', payment.hash ? Buffer.from(payment.hash).toString('hex') : undefined);
  console.log();
}

/**
 * Example 2: Construct a P2TSH address from a script tree with multiple leaves
 * This demonstrates a more complex script tree structure.
 */
function example2_multiLeafScriptTree() {
  console.log('=== Example 2: P2TSH from multi-leaf script tree ===');
  
  // Generate two different key pairs for the leaves
  const keyPair1 = ECPair.makeRandom({ rng });
  const keyPair2 = ECPair.makeRandom({ rng });
  const pubkey1 = keyPair1.publicKey;
  const pubkey2 = keyPair2.publicKey;
  
  const script1 = bscript.compile([pubkey1, bscript.OPS.OP_CHECKSIG]);
  const script2 = bscript.compile([pubkey2, bscript.OPS.OP_CHECKSIG]);
  
  // Create a script tree with two leaves (array of two leaf objects)
  const scriptTree: Taptree = [
    { output: script1 },
    { output: script2 },
  ];
  
  // Construct the P2TSH payment
  const payment = p2tsh({
    scriptTree: scriptTree,
  });
  
  console.log('Generated public keys:');
  console.log('  Pubkey 1:', pubkey1.toString('hex'));
  console.log('  Pubkey 2:', pubkey2.toString('hex'));
  console.log('Script tree leaves:');
  console.log('  Leaf 1:', bscript.toASM(script1));
  console.log('  Leaf 2:', bscript.toASM(script2));
  console.log('P2TSH Address:', payment.address);
  console.log('Output script:', bscript.toASM(payment.output!));
  console.log('Merkle root hash:', payment.hash ? Buffer.from(payment.hash).toString('hex') : undefined);
  console.log();
}

/**
 * Example 4: Construct a P2TSH address from a hash and redeem script
 * This demonstrates creating a P2TSH when you have the hash directly.
 */
function example3_fromHashAndRedeem() {
  console.log('=== Example 3: P2TSH from hash and redeem script ===');
  
  // Generate a key pair
  const keyPair = ECPair.makeRandom({ rng });
  const pubkey = keyPair.publicKey;
  const redeemScript = bscript.compile([pubkey, bscript.OPS.OP_CHECKSIG]);
  
  // Use a known hash (from test fixtures)
  const hash = Buffer.from(
    'b424dea09f840b932a00373cdcdbd25650b8c3acfe54a9f4a641a286721b8d26',
    'hex',
  );
  
  // Construct the P2TSH payment
  const payment = p2tsh({
    hash: hash,
    redeem: {
      output: redeemScript,
    },
  });
  
  console.log('Generated public key:', pubkey.toString('hex'));
  console.log('Redeem script:', bscript.toASM(redeemScript));
  console.log('Hash:', hash.toString('hex'));
  console.log('P2TSH Address:', payment.address);
  console.log('Output script:', bscript.toASM(payment.output!));
  console.log();
}

// Run all examples
console.log('P2TSH Address Construction Examples\n');
console.log('=====================================\n');

example1_simpleScriptTree();
example2_multiLeafScriptTree();
example3_fromHashAndRedeem();

console.log('=====================================');
console.log('All examples completed!');
