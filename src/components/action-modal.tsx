'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'exchange' | 'send';
}

export function ActionModal({ isOpen, onClose, type }: ActionModalProps) {
  const [formData, setFormData] = useState({
    asset: '',
    amount: '',
    network: '',
    address: '',
    fromAsset: '',
    toAsset: '',
  });

  const assets = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'DOT'];
  const networks = ['Bitcoin', 'Ethereum', 'Tron', 'BSC', 'Polygon'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const getModalTitle = () => {
    switch (type) {
      case 'deposit':
        return 'Deposit Crypto';
      case 'exchange':
        return 'Exchange Assets';
      case 'send':
        return 'Send Crypto';
      default:
        return 'Action';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='glass-card max-w-md border-light'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-primary'>
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {type === 'exchange' ? (
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='fromAsset'
                  className='text-sm font-medium muted-text'
                >
                  From Asset
                </Label>
                <Select
                  value={formData.fromAsset}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fromAsset: value })
                  }
                >
                  <SelectTrigger className='glass glass-hover border-light text-primary'>
                    <SelectValue placeholder='Select asset' />
                  </SelectTrigger>
                  <SelectContent className='glass-card border-light'>
                    {assets.map((asset) => (
                      <SelectItem
                        key={asset}
                        value={asset}
                        className='text-primary'
                      >
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='toAsset'
                  className='text-sm font-medium muted-text'
                >
                  To Asset
                </Label>
                <Select
                  value={formData.toAsset}
                  onValueChange={(value) =>
                    setFormData({ ...formData, toAsset: value })
                  }
                >
                  <SelectTrigger className='glass glass-hover border-light text-primary'>
                    <SelectValue placeholder='Select asset' />
                  </SelectTrigger>
                  <SelectContent className='glass-card border-light'>
                    {assets.map((asset) => (
                      <SelectItem
                        key={asset}
                        value={asset}
                        className='text-primary'
                      >
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <Label htmlFor='asset' className='text-sm font-medium muted-text'>
                Asset
              </Label>
              <Select
                value={formData.asset}
                onValueChange={(value) =>
                  setFormData({ ...formData, asset: value })
                }
              >
                <SelectTrigger className='glass glass-hover border-light text-primary'>
                  <SelectValue placeholder='Select asset' />
                </SelectTrigger>
                <SelectContent className='glass-card border-light'>
                  {assets.map((asset) => (
                    <SelectItem
                      key={asset}
                      value={asset}
                      className='text-primary'
                    >
                      {asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='amount' className='text-sm font-medium muted-text'>
              Amount
            </Label>
            <Input
              id='amount'
              type='number'
              placeholder='0.00'
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className='glass glass-hover bg-transparent h-12 border-light text-primary placeholder:muted-text'
            />
          </div>

          {type !== 'exchange' && (
            <div className='space-y-2'>
              <Label
                htmlFor='network'
                className='text-sm font-medium muted-text'
              >
                Network
              </Label>
              <Select
                value={formData.network}
                onValueChange={(value) =>
                  setFormData({ ...formData, network: value })
                }
              >
                <SelectTrigger className='glass glass-hover border-light text-primary'>
                  <SelectValue placeholder='Select network' />
                </SelectTrigger>
                <SelectContent className='glass-card border-light'>
                  {networks.map((network) => (
                    <SelectItem
                      key={network}
                      value={network}
                      className='text-primary'
                    >
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'send' && (
            <div className='space-y-2'>
              <Label
                htmlFor='address'
                className='text-sm font-medium muted-text'
              >
                Recipient Address
              </Label>
              <Input
                id='address'
                placeholder='Enter wallet address'
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='glass glass-hover bg-transparent border-light text-primary placeholder:muted-text'
              />
            </div>
          )}

          <div className='flex gap-4 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1 btn-secondary bg-transparent'
            >
              Cancel
            </Button>
            <Button type='submit' className='flex-1 btn-primary'>
              {type === 'deposit'
                ? 'Generate Address'
                : type === 'exchange'
                  ? 'Get Quote'
                  : 'Send'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
