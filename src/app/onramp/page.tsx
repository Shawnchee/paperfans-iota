"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2, CheckCircle } from "lucide-react";

export default function OnrampPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setModalOpen(true);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setBalance((b) => b + amt);
      setAmount("");
    }, 1500);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="max-w-md w-full p-8 shadow-lg bg-black/80 border border-white/10">
        <h1 className="text-2xl font-bold mb-6 neon-cyan text-center">Onramping & Wallet Balance</h1>
        <div className="flex flex-col items-center mb-8">
          <DollarSign className="h-10 w-10 neon-cyan mb-2" />
          <div className="text-lg text-gray-300">MUSDT Balance</div>
          <div className="text-3xl font-mono font-bold neon-cyan mb-2">{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} MUSDT</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">How much MUSDT do you want to buy?</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="sci-fi-input text-white placeholder-gray-400"
              placeholder="Enter amount"
              disabled={processing}
            />
          </div>
          <Button
            className="w-full sci-fi-button text-white font-semibold mt-2"
            onClick={handleBuy}
            disabled={processing || !amount || parseFloat(amount) <= 0}
          >
            Buy MUSDT
          </Button>
        </div>
        <div className="mt-8 text-xs text-gray-500 text-center">
          This is a mock onramp. MUSDT is a test token for demo purposes only.
        </div>
      </Card>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10, 20, 40, 0.95)' }}>
          <div className="rounded-xl p-8 shadow-2xl border border-neon-cyan/40 min-w-[320px] flex flex-col items-center bg-gradient-to-br from-[#0a1a28] via-[#1a2233] to-[#0a1a28] backdrop-blur-xl">
            {processing ? (
              <>
                <Loader2 className="h-10 w-10 neon-cyan animate-spin mb-4" />
                <div className="text-lg text-gray-200 mb-2">Processing payment...</div>
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
                <div className="text-lg text-green-400 mb-2">Purchase successful!</div>
                <Button className="mt-2 sci-fi-button" onClick={handleCloseModal}>Close</Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 