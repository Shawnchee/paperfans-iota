"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2, CheckCircle, Wallet, AlertCircle } from "lucide-react";
import { ConnectButton, useCurrentAccount } from '@iota/dapp-kit';
import { useMUSDT } from "@/lib/musdt-service";
import { useToast } from "@/hooks/use-toast";
import { ContractStatus } from "@/components/contract-status";

export default function OnrampPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
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
        toast({
          title: "MUSDT Minted Successfully!",
          description: `Transaction ID: ${result.transactionId}`,
        });
      } else {
        setError(result.error || "Failed to mint MUSDT");
        toast({
          title: "Minting Failed",
          description: result.error || "Failed to mint MUSDT",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred while minting MUSDT",
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
        {/* Contract Status */}
        <ContractStatus className="mb-6" />
        
        {/* Main Onramp Card */}
        <Card className="max-w-md w-full p-8 shadow-lg bg-black/80 border border-white/10 mx-auto">
          <h1 className="text-2xl font-bold mb-6 neon-cyan text-center">Onramping & Wallet Balance</h1>
          
          {/* Wallet Connection Status */}
          <div className="mb-6 p-4 rounded-lg border border-white/10 bg-black/50">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-400">
                <Wallet className="h-5 w-5" />
                <span className="text-sm">Wallet Connected</span>
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
                How much MUSDT do you want to mint?
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
              {isConnected ? "Mint MUSDT" : "Connect Wallet First"}
            </Button>
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center">
            MUSDT is a test token for demo purposes only. Connect your wallet to mint tokens.
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
                <div className="text-lg text-gray-200 mb-2">Minting MUSDT...</div>
                <div className="text-sm text-gray-400 text-center">
                  This may take a few moments
                </div>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
                <div className="text-lg text-green-400 mb-2">MUSDT Minted Successfully!</div>
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
                <div className="text-lg text-red-400 mb-2">Minting Failed</div>
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