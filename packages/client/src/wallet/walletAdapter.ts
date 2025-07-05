/**
 * WalletAdapter interface for client integration
 *
 * This file provides a wrapper for the @aptos-labs/wallet-adapter-react useWallet hook.
 *
 * For browser usage, implement this with the actual wallet adapter logic.
 */
import { WalletAdapter as IWalletAdapter, AptosAddress, AptosTransactionPayload, SignedTransaction, AptosTransactionHash } from '@xapt/common';

export class WalletAdapter implements IWalletAdapter {
  isConnected(): boolean {
    throw new Error('Not implemented: isConnected');
  }
  getAccountAddress(): AptosAddress | null {
    throw new Error('Not implemented: getAccountAddress');
  }
  async signTransaction(_payload: AptosTransactionPayload): Promise<SignedTransaction> {
    throw new Error('Not implemented: signTransaction');
  }
  async signAndSubmitTransaction(_payload: AptosTransactionPayload): Promise<AptosTransactionHash> {
    throw new Error('Not implemented: signAndSubmitTransaction');
  }
  async connect(): Promise<void> {
    throw new Error('Not implemented: connect');
  }
  async disconnect(): Promise<void> {
    throw new Error('Not implemented: disconnect');
  }
} 