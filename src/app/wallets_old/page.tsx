'use client';

import { useState } from 'react';
import { Plus, Eye, Copy, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function WalletsPage() {
  const [showNewWalletModal, setShowNewWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const wallets = [
    {
      id: 1,
      name: 'Main Bitcoin Wallet',
      asset: 'BTC',
      network: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      balance: 1.25,
      value: 52500,
      gradient: 'from-orange-400 to-yellow-500',
    },
    {
      id: 2,
      name: 'Ethereum Trading',
      asset: 'ETH',
      network: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
      balance: 15.5,
      value: 38750,
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 3,
      name: 'USDT Savings',
      asset: 'USDT',
      network: 'Tron',
      address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      balance: 5000,
      value: 5000,
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      id: 4,
      name: 'BNB Staking',
      asset: 'BNB',
      network: 'BSC',
      address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      balance: 25.8,
      value: 7740,
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 5,
      name: 'Cardano Wallet',
      asset: 'ADA',
      network: 'Cardano',
      address:
        'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3zcjqg8rgs',
      balance: 1000,
      value: 450,
      gradient: 'from-blue-600 to-indigo-700',
    },
    {
      id: 6,
      name: 'Solana Portfolio',
      asset: 'SOL',
      network: 'Solana',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      balance: 50.2,
      value: 3500,
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-main'>Crypto Wallets</h1>
            <p className='muted-text text-lg'>
              Manage your cryptocurrency wallets
            </p>
          </div>
          <Button
            onClick={() => setShowNewWalletModal(true)}
            className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Plus className='w-4 h-4 mr-2' />
            New Wallet
          </Button>
        </div>

        {/* Wallets Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className='glass-card-enhanced glass-hover cursor-pointer overflow-hidden'
              onClick={() => setSelectedWallet(wallet)}
            >
              <CardContent className='p-0'>
                {/* Wallet Card Visual */}
                <div
                  className={`relative h-48 bg-linear-to-br ${wallet.gradient} p-6 overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/30'></div>
                    <div className='absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20'></div>
                    <div className='absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2'></div>
                  </div>

                  {/* Wallet Content */}
                  <div className='relative z-10 h-full flex flex-col justify-between text-white'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-lg'>{wallet.name}</h3>
                        <p className='text-sm opacity-90'>{wallet.network}</p>
                      </div>
                      <Wallet className='w-8 h-8 opacity-80' />
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>Balance</span>
                        <span className='font-bold text-lg'>
                          {wallet.balance} {wallet.asset}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>USD Value</span>
                        <span className='font-bold text-xl'>
                          ${wallet.value.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-mono opacity-80'>
                          {truncateAddress(wallet.address)}
                        </span>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(wallet.address);
                          }}
                          className='h-6 w-6 p-0 hover:bg-white/20 text-white'
                        >
                          <Copy className='w-3 h-3' />
                        </Button>
                      </div>
                      <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                        <span className='font-bold text-sm'>
                          {wallet.asset}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Actions */}
                <div className='p-4 space-y-3'>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWallet(wallet);
                      }}
                      className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300'
                    >
                      <Eye className='w-4 h-4 mr-2' />
                      View Details
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='glass-button bg-transparent'
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(wallet.address);
                      }}
                    >
                      <Copy className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Wallet Modal */}
        <Dialog open={showNewWalletModal} onOpenChange={setShowNewWalletModal}>
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                Add New Wallet
              </DialogTitle>
            </DialogHeader>
            <form className='space-y-6'>
              <div>
                <Label className='text-sm font-medium muted-text'>
                  Wallet Name
                </Label>
                <Input
                  placeholder='My Bitcoin Wallet'
                  className='glass-input mt-1'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium muted-text'>
                    Asset
                  </Label>
                  <Select>
                    <SelectTrigger className='glass-input mt-1'>
                      <SelectValue placeholder='Select asset' />
                    </SelectTrigger>
                    <SelectContent className='glass-card-enhanced'>
                      <SelectItem value='btc'>Bitcoin (BTC)</SelectItem>
                      <SelectItem value='eth'>Ethereum (ETH)</SelectItem>
                      <SelectItem value='usdt'>Tether (USDT)</SelectItem>
                      <SelectItem value='bnb'>Binance Coin (BNB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='text-sm font-medium muted-text'>
                    Network
                  </Label>
                  <Select>
                    <SelectTrigger className='glass-input mt-1'>
                      <SelectValue placeholder='Select network' />
                    </SelectTrigger>
                    <SelectContent className='glass-card-enhanced'>
                      <SelectItem value='bitcoin'>Bitcoin</SelectItem>
                      <SelectItem value='ethereum'>Ethereum</SelectItem>
                      <SelectItem value='tron'>Tron</SelectItem>
                      <SelectItem value='bsc'>BSC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className='text-sm font-medium muted-text'>
                  Wallet Address
                </Label>
                <Input
                  placeholder='Enter wallet address'
                  className='glass-input mt-1'
                />
              </div>
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowNewWalletModal(false)}
                  className='flex-1 glass-button'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold'
                >
                  Add Wallet
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Wallet Details Modal */}
        <Dialog
          open={!!selectedWallet}
          onOpenChange={() => setSelectedWallet(null)}
        >
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                Wallet Details
              </DialogTitle>
            </DialogHeader>
            {selectedWallet && (
              <div className='space-y-6'>
                {/* Wallet Card in Modal */}
                <div
                  className={`relative h-40 bg-linear-to-br ${selectedWallet.gradient} p-6 rounded-xl overflow-hidden`}
                >
                  <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-4 right-4 w-12 h-12 rounded-full bg-white/30'></div>
                    <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
                  </div>

                  <div className='relative z-10 h-full flex flex-col justify-between text-white'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-lg'>
                          {selectedWallet.name}
                        </h3>
                        <p className='text-sm opacity-90'>
                          {selectedWallet.network} Network
                        </p>
                      </div>
                      <Wallet className='w-8 h-8 opacity-80' />
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>Balance</span>
                        <span className='font-bold text-lg'>
                          {selectedWallet.balance} {selectedWallet.asset}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>USD Value</span>
                        <span className='font-bold text-xl'>
                          ${selectedWallet.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div className='glass-item p-4'>
                  <Label className='muted-text text-sm'>Full Address</Label>
                  <div className='flex items-center gap-2 mt-2'>
                    <code className='flex-1 p-3 bg-surface rounded-lg text-sm font-mono break-all text-main border border-black/10'>
                      {selectedWallet.address}
                    </code>
                    <Button
                      size='sm'
                      onClick={() => copyToClipboard(selectedWallet.address)}
                      className='bg-primary hover:bg-primary/90 text-white'
                    >
                      <Copy className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    variant='outline'
                    className='glass-button bg-transparent'
                  >
                    Send
                  </Button>
                  <Button
                    variant='outline'
                    className='glass-button bg-transparent'
                  >
                    Receive
                  </Button>
                  <Button
                    variant='outline'
                    className='glass-button bg-transparent'
                  >
                    History
                  </Button>
                  <Button className='bg-primary hover:bg-primary/90 text-white font-semibold'>
                    Settings
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
