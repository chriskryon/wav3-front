'use client';

import { useState } from 'react';
import { Plus, CreditCard, Eye, Settings, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function CardsPage() {
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const cards = [
    {
      id: 1,
      name: 'OND4 Platinum Card',
      type: 'Virtual',
      number: '**** **** **** 1234',
      balance: 2500.0,
      status: 'Active',
      network: 'Visa',
      gradient: 'from-purple-600 via-blue-600 to-indigo-700',
      textColor: 'text-white',
    },
    {
      id: 2,
      name: 'OND4 Black Card',
      type: 'Physical',
      number: '**** **** **** 5678',
      balance: 15000.0,
      status: 'Active',
      network: 'Mastercard',
      gradient: 'from-gray-800 via-gray-900 to-black',
      textColor: 'text-white',
    },
    {
      id: 3,
      name: 'OND4 Gold Card',
      type: 'Virtual',
      number: '**** **** **** 9012',
      balance: 750.0,
      status: 'Frozen',
      network: 'Visa',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      textColor: 'text-white',
    },
    {
      id: 4,
      name: 'OND4 Silver Card',
      type: 'Physical',
      number: '**** **** **** 3456',
      balance: 1200.0,
      status: 'Active',
      network: 'Visa',
      gradient: 'from-gray-300 via-gray-400 to-gray-500',
      textColor: 'text-gray-800',
    },
    {
      id: 5,
      name: 'OND4 Business Card',
      type: 'Virtual',
      number: '**** **** **** 7890',
      balance: 5000.0,
      status: 'Active',
      network: 'Mastercard',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      textColor: 'text-white',
    },
    {
      id: 6,
      name: 'OND4 Student Card',
      type: 'Virtual',
      number: '**** **** **** 2468',
      balance: 300.0,
      status: 'Frozen',
      network: 'Visa',
      gradient: 'from-green-500 via-emerald-600 to-teal-700',
      textColor: 'text-white',
    },
  ];

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-main'>Cards</h1>
            <p className='muted-text text-lg'>Manage your CRIPTO debit cards</p>
          </div>
          <Button className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'>
            <Plus className='w-4 h-4 mr-2' />
            Order Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cards.map((card) => (
            <Card
              key={card.id}
              className='glass-card-enhanced glass-hover cursor-pointer overflow-hidden'
              onClick={() => setSelectedCard(card)}
            >
              <CardContent className='p-0'>
                {/* Credit Card Visual */}
                <div
                  className={`relative h-56 bg-linear-to-br ${card.gradient} p-6 overflow-hidden`}
                >
                  {/* Card Pattern */}
                  <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-6 right-6 w-20 h-20 rounded-full bg-white/30'></div>
                    <div className='absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white/20'></div>
                    <div className='absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2'></div>
                  </div>

                  {/* Card Content */}
                  <div
                    className={`relative z-10 h-full flex flex-col justify-between ${card.textColor}`}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-lg'>{card.name}</h3>
                        <p className='text-sm opacity-90'>{card.type}</p>
                      </div>
                      <CreditCard className='w-8 h-8 opacity-80' />
                    </div>

                    <div className='space-y-3'>
                      <div className='text-2xl font-mono tracking-wider font-bold'>
                        {card.number}
                      </div>
                      <div className='flex justify-between items-end'>
                        <div>
                          <p className='text-xs opacity-80'>BALANCE</p>
                          <p className='text-xl font-bold'>
                            ${card.balance.toLocaleString()}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-bold'>{card.network}</p>
                          <div className='flex items-center gap-1 mt-1'>
                            {card.status === 'Active' ? (
                              <Unlock className='w-4 h-4 opacity-80' />
                            ) : (
                              <Lock className='w-4 h-4 opacity-80' />
                            )}
                            <span className='text-xs opacity-80'>
                              {card.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className='p-6 space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='muted-text'>Status:</span>
                    <Badge
                      className={`text-xs font-medium ${
                        card.status === 'Active'
                          ? 'bg-green-500/20 text-green-500 border-green-500/30'
                          : 'bg-red-500/20 text-red-500 border-red-500/30'
                      }`}
                    >
                      {card.status}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='muted-text'>Type:</span>
                    <span className='font-semibold text-main'>{card.type}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='muted-text'>Network:</span>
                    <span className='font-semibold text-main'>
                      {card.network}
                    </span>
                  </div>

                  {/* Card Actions */}
                  <div className='flex gap-2 pt-2'>
                    <Button
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                      className='flex-1 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300'
                    >
                      <Eye className='w-4 h-4 mr-2' />
                      View
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='glass-button bg-transparent'
                    >
                      <Settings className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Card Benefits Section */}
        <Card className='glass-card-enhanced'>
          <CardHeader>
            <CardTitle className='text-xl font-bold text-main'>
              OND4 Card Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto'>
                  <CreditCard className='w-8 h-8 text-primary' />
                </div>
                <h3 className='font-bold text-lg text-main'>
                  Instant Spending
                </h3>
                <p className='text-sm muted-text'>
                  Use your crypto balance instantly at millions of locations
                  worldwide
                </p>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto'>
                  <span className='text-2xl font-bold text-green-500'>0%</span>
                </div>
                <h3 className='font-bold text-lg text-main'>No Foreign Fees</h3>
                <p className='text-sm muted-text'>
                  Spend abroad without worrying about foreign transaction fees
                </p>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto'>
                  <span className='text-2xl font-bold text-blue-500'>5%</span>
                </div>
                <h3 className='font-bold text-lg text-main'>Crypto Rewards</h3>
                <p className='text-sm muted-text'>
                  Earn up to 5% back in crypto on all your purchases
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Details Modal */}
        <Dialog
          open={!!selectedCard}
          onOpenChange={() => setSelectedCard(null)}
        >
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                Card Details
              </DialogTitle>
            </DialogHeader>
            {selectedCard && (
              <div className='space-y-6'>
                {/* Card Visual in Modal */}
                <div
                  className={`relative h-48 bg-linear-to-br ${selectedCard.gradient} p-6 rounded-xl overflow-hidden`}
                >
                  <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/30'></div>
                    <div className='absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20'></div>
                  </div>

                  <div
                    className={`relative z-10 h-full flex flex-col justify-between ${selectedCard.textColor}`}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-lg'>
                          {selectedCard.name}
                        </h3>
                        <p className='text-sm opacity-90'>
                          {selectedCard.type}
                        </p>
                      </div>
                      <CreditCard className='w-8 h-8 opacity-80' />
                    </div>

                    <div className='space-y-2'>
                      <div className='text-xl font-mono tracking-wider font-bold'>
                        {selectedCard.number}
                      </div>
                      <div className='flex justify-between items-end'>
                        <div>
                          <p className='text-xs opacity-80'>BALANCE</p>
                          <p className='text-xl font-bold'>
                            ${selectedCard.balance.toLocaleString()}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-bold'>
                            {selectedCard.network}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='glass-item p-4'>
                      <Label className='muted-text text-xs'>Status</Label>
                      <p className='font-semibold text-main'>
                        {selectedCard.status}
                      </p>
                    </div>
                    <div className='glass-item p-4'>
                      <Label className='muted-text text-xs'>Type</Label>
                      <p className='font-semibold text-main'>
                        {selectedCard.type}
                      </p>
                    </div>
                  </div>

                  <div className='glass-item p-4'>
                    <Label className='muted-text text-xs'>
                      Available Balance
                    </Label>
                    <p className='text-2xl font-bold primary-text'>
                      ${selectedCard.balance.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    className='glass-button bg-transparent'
                    variant='outline'
                  >
                    View Transactions
                  </Button>
                  <Button
                    className='glass-button bg-transparent'
                    variant='outline'
                  >
                    Card Settings
                  </Button>
                  <Button
                    className='glass-button bg-transparent'
                    variant='outline'
                  >
                    {selectedCard.status === 'Active'
                      ? 'Freeze Card'
                      : 'Unfreeze Card'}
                  </Button>
                  <Button className='bg-primary hover:bg-primary/90 text-white font-semibold'>
                    Top Up
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
