"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2, CheckCircle, Wallet, AlertCircle } from "lucide-react";
import { ConnectButton, useCurrentAccount } from '@iota/dapp-kit';
import { useMUSDT } from "@/lib/musdt-service";
import { useToast } from "@/hooks/use-toast";


export default function OnrampPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  
  
  const account = useCurrentAccount();
  const { getBalance, mintTokens, isConnected } = useMUSDT();
  const { toast } = useToast();

  // Load balance when wallet is connected
  useEffect(() => {
    if (isConnected && account?.address) {
      loadBalance();
    }
  }, [isConnected, account?.address]);

  const loadBalance = async () => {
    try {
      const currentBalance = await getBalance();
      setBalance(currentBalance);
    } catch (err) {
      console.error('Error loading balance:', err);
    }
  };

  const handleBuy = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setModalOpen(true);
    setProcessing(true);
    setError("");

    try {
      const result = await mintTokens(amt);
      
      if (result.success) {
        setSuccess(true);
        setBalance((b) => b + amt);
        setAmount("");
        setTransactionHash(result.transactionId ?? null);

        toast({
          title: "MUSDT Purchased Successfully!",
          description: `Transaction ID: ${result.transactionId}`,
        });
      } else {
        setError(result.error || "Failed to mint MUSDT");
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase MUSDT",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
              toast({
          title: "Error",
          description: "An unexpected error occurred while purchasing MUSDT",
          variant: "destructive",
        });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSuccess(false);
    setError("");
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl w-full space-y-6">
        {/* Main Onramp Card */}
        <Card className="max-w-md w-full p-8 shadow-lg bg-black/80 border border-white/10 mx-auto">
          <h1 className="text-2xl font-bold mb-6 neon-cyan text-center">Purchase MUSDT & Wallet Balance</h1>
          
          {/* Wallet Connection Status */}
          <div className="mb-6 p-4 rounded-lg border border-white/10 bg-black/50">
            {isConnected ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-400">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm">Wallet Connected</span>
                </div>
                {account?.address && (
                  <div className="text-xs text-gray-400 font-mono">
                    Address: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Wallet Not Connected</span>
              </div>
            )}
            <div className="mt-2">
              <ConnectButton />
            </div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <DollarSign className="h-10 w-10 neon-cyan mb-2" />
            <div className="text-lg text-gray-300">MUSDT Balance</div>
            <div className="text-3xl font-mono font-bold neon-cyan mb-2">
              {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} MUSDT
            </div>
            {account?.address && (
              <div className="text-xs text-gray-500 mt-1">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1 font-medium">
                How much MUSDT do you want to purchase?
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="sci-fi-input text-white placeholder-gray-400"
                placeholder="Enter amount"
                disabled={processing || !isConnected}
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded border border-red-400/20">
                {error}
              </div>
            )}

            <Button
  className="w-full sci-fi-button text-white font-semibold mt-2"
  onClick={handleBuy}
  disabled={processing || !amount || parseFloat(amount) <= 0 || !isConnected}
>
  {isConnected ? "Purchase MUSDT" : "Connect Wallet First"}
</Button>

{/* Transaction Hash Display - Add this section */}
{transactionHash && (
  <div className="mt-4 p-3 rounded-lg border border-neon-cyan/30 bg-black/60">
    <div className="text-xs text-gray-400 mb-1">Transaction Hash:</div>
    <div className="flex items-center">
      <code className="text-xs font-mono text-neon-cyan truncate mr-2 flex-1">
        {transactionHash}
      </code>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
        onClick={() => {
          navigator.clipboard.writeText(transactionHash);
          toast({
            title: "Copied!",
            description: "Transaction hash copied to clipboard",
          });
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </Button>
    </div>
    <a 
      href={`https://explorer.iota.org/txblock/${transactionHash}?network=testnet`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 text-xs inline-flex items-center text-neon-cyan hover:text-neon-cyan/80 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      View on IOTA Explorer
    </a>
  </div>
)}
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center">
            MUSDT is a test token for demo purposes only. Connect your wallet to purchase tokens.
          </div>
        </Card>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10, 20, 40, 0.95)' }}>
          <div className="rounded-xl p-8 shadow-2xl border border-neon-cyan/40 min-w-[320px] flex flex-col items-center bg-gradient-to-br from-[#0a1a28] via-[#1a2233] to-[#0a1a28] backdrop-blur-xl">
            {processing ? (
              <>
                <Loader2 className="h-10 w-10 neon-cyan animate-spin mb-4" />
                <div className="text-lg text-gray-200 mb-2">Purchasing MUSDT...</div>
                <div className="text-sm text-gray-400 text-center">
                  This may take a few moments
                </div>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
                <div className="text-lg text-green-400 mb-2">MUSDT Purchased Successfully!</div>
                <div className="text-sm text-gray-400 text-center mb-4">
                  Your tokens have been added to your wallet
                </div>
                <Button className="mt-2 sci-fi-button" onClick={handleCloseModal}>
                  Close
                </Button>
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
                <div className="text-lg text-red-400 mb-2">Purchase Failed</div>
                <div className="text-sm text-gray-400 text-center mb-4">
                  {error}
                </div>
                <Button className="mt-2 sci-fi-button" onClick={handleCloseModal}>
                  Close
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 