'use client';

import { useState } from 'react';
import {
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TokenBTC,
  TokenETH,
  TokenRIF,
  TokenUSDT,
  TokenXRP,
} from '@web3icons/react';
import React from 'react';
import { FakeDataAlert } from '@/components/FakeDataAlert';

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const assetIcons = {
    USDRIF: TokenRIF,
    BTC: TokenBTC,
    ETH: TokenETH,
    XRP: TokenXRP,
    USDT: TokenUSDT,
  };

  const assets = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'Crypto',
      network: 'Bitcoin',
      balance: 1.25,
      value: 52500,
      change: 5.2,
      price: 42000,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'Crypto',
      network: 'Ethereum',
      balance: 15.5,
      value: 38750,
      change: -2.1,
      price: 2500,
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      type: 'Crypto',
      network: 'Tron',
      balance: 5000,
      value: 5000,
      change: 0.1,
      price: 1,
    },
    {
      name: 'US Dollar',
      symbol: 'USD',
      type: 'Fiat',
      network: 'Traditional',
      balance: 8750.25,
      value: 8750.25,
      change: 0,
      price: 1,
    },
  ];

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto h-full flex flex-col'>
        <FakeDataAlert />
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-main'>Assets</h1>
            <p className='muted-text text-lg'>
              Manage your crypto and fiat assets
            </p>
          </div>
          <Button className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Refresh
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className='glass-card-enhanced mb-8'>
          <CardContent className='p-6'>
            <div className='flex gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 muted-text' />
                <Input
                  placeholder='Search assets...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-12 h-12 glass-input'
                />
              </div>
              <Button
                variant='outline'
                className='glass-button h-12 px-6 bg-transparent'
              >
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Tabs */}
        <div className='flex-1 flex flex-col'>
          <Tabs defaultValue='all' className='flex-1 flex flex-col'>
            <TabsList className='glass-tabs mb-8 p-1 self-start'>
              <TabsTrigger value='all' className='glass-tab-trigger'>
                All Assets
              </TabsTrigger>
              <TabsTrigger value='crypto' className='glass-tab-trigger'>
                Crypto
              </TabsTrigger>
              <TabsTrigger value='fiat' className='glass-tab-trigger'>
                Fiat
              </TabsTrigger>
            </TabsList>

            <TabsContent value='all' className='flex-1'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-area h-full'>
                {filteredAssets.map((asset, _index) => (
                  <Card
                    key={asset.symbol}
                    className='glass-card-enhanced glass-hover cursor-pointer h-fit'
                  >
                    <CardHeader className='pb-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md'>
                            {assetIcons[
                              asset.symbol as keyof typeof assetIcons
                            ] ? (
                              React.createElement(
                                assetIcons[
                                  asset.symbol as keyof typeof assetIcons
                                ],
                                { variant: 'mono', size: 32, color: '#FFF' },
                              )
                            ) : (
                              <span className='font-bold text-sm'>
                                {asset.symbol.slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div>
                            <CardTitle className='text-lg font-bold text-main'>
                              {asset.name}
                            </CardTitle>
                            <p className='text-sm muted-text'>{asset.symbol}</p>
                          </div>
                        </div>
                        <Badge
                          className={`glass-badge ${
                            asset.type === 'Crypto'
                              ? 'text-primary border-primary/30'
                              : 'text-main border-main/30'
                          }`}
                        >
                          {asset.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex justify-between'>
                        <span className='muted-text'>Balance:</span>
                        <span className='font-semibold text-main'>
                          {asset.balance} {asset.symbol}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='muted-text'>Value:</span>
                        <span className='font-bold text-main'>
                          ${asset.value.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='muted-text'>24h Change:</span>
                        <div
                          className={`flex items-center gap-2 font-semibold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {asset.change >= 0 ? (
                            <TrendingUp className='w-4 h-4' />
                          ) : (
                            <TrendingDown className='w-4 h-4' />
                          )}
                          <span>{Math.abs(asset.change)}%</span>
                        </div>
                      </div>
                      <div className='flex justify-between'>
                        <span className='muted-text'>Network:</span>
                        <span className='text-sm font-medium text-main'>
                          {asset.network}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='crypto' className='flex-1'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-area h-full'>
                {filteredAssets
                  .filter((asset) => asset.type === 'Crypto')
                  .map((asset) => (
                    <Card
                      key={asset.symbol}
                      className='glass-card-enhanced glass-hover cursor-pointer h-fit'
                    >
                      <CardHeader className='pb-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md'>
                            {assetIcons[
                              asset.symbol as keyof typeof assetIcons
                            ] ? (
                              React.createElement(
                                assetIcons[
                                  asset.symbol as keyof typeof assetIcons
                                ],
                                { variant: 'mono', size: 32, color: '#FFF' },
                              )
                            ) : (
                              <span className='font-bold text-sm'>
                                {asset.symbol.slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div>
                            <CardTitle className='text-lg font-bold text-main'>
                              {asset.name}
                            </CardTitle>
                            <p className='text-sm muted-text'>{asset.symbol}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='flex justify-between'>
                          <span className='muted-text'>Balance:</span>
                          <span className='font-semibold text-main'>
                            {asset.balance} {asset.symbol}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='muted-text'>Value:</span>
                          <span className='font-bold text-main'>
                            ${asset.value.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='muted-text'>24h Change:</span>
                          <div
                            className={`flex items-center gap-2 font-semibold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {asset.change >= 0 ? (
                              <TrendingUp className='w-4 h-4' />
                            ) : (
                              <TrendingDown className='w-4 h-4' />
                            )}
                            <span>{Math.abs(asset.change)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value='fiat' className='flex-1'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-area h-full'>
                {filteredAssets
                  .filter((asset) => asset.type === 'Fiat')
                  .map((asset) => (
                    <Card
                      key={asset.symbol}
                      className='glass-card-enhanced glass-hover cursor-pointer h-fit'
                    >
                      <CardHeader className='pb-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md'>
                            <span className='font-bold text-sm'>
                              {asset.symbol}
                            </span>
                          </div>
                          <div>
                            <CardTitle className='text-lg font-bold text-main'>
                              {asset.name}
                            </CardTitle>
                            <p className='text-sm muted-text'>{asset.symbol}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='flex justify-between'>
                          <span className='muted-text'>Balance:</span>
                          <span className='font-bold text-main'>
                            ${asset.balance.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='muted-text'>Type:</span>
                          <span className='text-sm font-medium text-main'>
                            {asset.network}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
