"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Settings, ExternalLink } from "lucide-react";
import { CONTRACT_CONFIG, getContractAddress, getTreasuryCapAddress, getSupplyAddress } from "@/lib/contract-config";

interface ContractStatusProps {
  className?: string;
}

export function ContractStatus({ className }: ContractStatusProps) {
  const [showDetails, setShowDetails] = useState(false);

  const contractAddress = getContractAddress('MUSDT');
  const treasuryCapAddress = getTreasuryCapAddress();
  const supplyAddress = getSupplyAddress();

  const isConfigured = contractAddress !== "0x..." && 
                      treasuryCapAddress !== "0x..." && 
                      supplyAddress !== "0x...";

  const getStatusColor = (address: string) => {
    return address === "0x..." ? "destructive" : "default";
  };

  const getStatusIcon = (address: string) => {
    return address === "0x..." ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />;
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Contract Status</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          {showDetails ? "Hide" : "Show"} Details
        </Button>
      </div>

      <div className="space-y-3">
        {/* Overall Status */}
        <div className="flex items-center space-x-2">
          {isConfigured ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          )}
          <span className="text-sm">
            {isConfigured ? "Contracts Configured" : "Contracts Not Deployed"}
          </span>
          <Badge variant={isConfigured ? "default" : "destructive"}>
            {isConfigured ? "Ready" : "Setup Required"}
          </Badge>
        </div>

        {/* Contract Details */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-400">Contract Addresses:</div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(contractAddress)}
                <span className="text-xs text-gray-300">Contract:</span>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                  {contractAddress === "0x..." ? "Not configured" : contractAddress.slice(0, 10) + "..."}
                </code>
                <Badge variant={getStatusColor(contractAddress)}>
                  {contractAddress === "0x..." ? "Missing" : "Configured"}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusIcon(treasuryCapAddress)}
                <span className="text-xs text-gray-300">Treasury Cap:</span>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                  {treasuryCapAddress === "0x..." ? "Not configured" : treasuryCapAddress.slice(0, 10) + "..."}
                </code>
                <Badge variant={getStatusColor(treasuryCapAddress)}>
                  {treasuryCapAddress === "0x..." ? "Missing" : "Configured"}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusIcon(supplyAddress)}
                <span className="text-xs text-gray-300">Supply Object:</span>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                  {supplyAddress === "0x..." ? "Not configured" : supplyAddress.slice(0, 10) + "..."}
                </code>
                <Badge variant={getStatusColor(supplyAddress)}>
                  {supplyAddress === "0x..." ? "Missing" : "Configured"}
                </Badge>
              </div>
            </div>

            {/* Configuration Instructions */}
            {!isConfigured && (
              <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded">
                <div className="text-xs text-yellow-400 font-medium mb-2">
                  Setup Required:
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>1. Deploy the MUSDT contract from <code className="bg-gray-800 px-1">contract/isc-rwa/smart-contracts2</code></div>
                  <div>2. Update addresses in <code className="bg-gray-800 px-1">src/lib/contract-config.ts</code></div>
                  <div>3. Restart the application</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => window.open('/MUSDT_INTEGRATION.md', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Setup Guide
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 