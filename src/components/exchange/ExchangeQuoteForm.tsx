'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { TokenIcon } from '@/components/ui/token-icon';
import { US } from 'country-flag-icons/react/3x2';
import { BR } from 'country-flag-icons/react/3x2';
import { MX } from 'country-flag-icons/react/3x2';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { MOCK_ASSETS, MOCK_QUOTES } from './exchange-mocks';

export function ExchangeQuoteForm() {
  // Estado para ativos, redes, valores, loading, erro, etc.
  const [assets] = useState(MOCK_ASSETS);
  const [sourceAsset, setSourceAsset] = useState(assets[0]);
  const [targetAsset, setTargetAsset] = useState(assets[1]);
  const [network, setNetwork] = useState(sourceAsset.networks[0]?.id || '');
  const [sourceAmount, setSourceAmount] = useState('1');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(20);
  const [direction, setDirection] = useState<'pay' | 'receive'>('pay');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: form, 1: confirm, 2: success

  // Permite apenas FIAT -> CRYPTO ou CRYPTO -> FIAT
  const isFiatToCrypto =
    sourceAsset.type === 'fiat' && targetAsset.type === 'crypto';
  const isCryptoToFiat =
    sourceAsset.type === 'crypto' && targetAsset.type === 'fiat';
  const isValidPair = isFiatToCrypto || isCryptoToFiat;

  // Simula quote (POST /v1/quote)
  const getQuote = () => {
    if (!isValidPair) {
      setError('Only FIAT to CRYPTO or CRYPTO to FIAT quotes are supported.');
      setQuote(null);
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const key = `${sourceAsset.symbol}_${targetAsset.symbol}`.toUpperCase();
      if (MOCK_QUOTES[key]) {
        setQuote(MOCK_QUOTES[key]);
        setStep(1); // Avança para confirmação
      } else {
        setQuote(null);
        setError('No quote available for this pair.');
      }
      setLoading(false);
      setTimer(20);
    }, 800);
  };

  // Timer para quote expirar
  useEffect(() => {
    if (!quote) return;
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [quote, timer]);

  // Atualiza network ao trocar asset
  useEffect(() => {
    setNetwork(sourceAsset.networks[0]?.id || '');
  }, [sourceAsset]);

  // Troca direção (pay/receive)
  const handleSwap = () => {
    setSourceAsset(targetAsset);
    setTargetAsset(sourceAsset);
    setQuote(null);
    setTimer(20);
  };

  // Stepper UI
  return (
    <div className='w-full max-w-2xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col gap-10 border-2 border-[#1ea3ab]/30 mt-10 mb-10 min-h-[700px] justify-center relative'>
      {/* Stepper header */}
      <div className='flex items-center justify-center gap-4 mb-6'>
        <div
          className={`flex flex-col items-center ${step === 0 ? 'text-[#1ea3ab]' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 0 ? 'border-[#1ea3ab] bg-[#e6f7f8]' : 'border-gray-300 bg-white'}`}
          >
            1
          </div>
          <span className='text-xs mt-1'>Quote</span>
        </div>
        <div className='w-8 h-1 bg-gradient-to-r from-[#1ea3ab] to-gray-200 rounded-full' />
        <div
          className={`flex flex-col items-center ${step === 1 ? 'text-[#1ea3ab]' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 1 ? 'border-[#1ea3ab] bg-[#e6f7f8]' : 'border-gray-300 bg-white'}`}
          >
            2
          </div>
          <span className='text-xs mt-1'>Confirm</span>
        </div>
      </div>

      {/* Step 0: Formulário de cotação */}
      {step === 0 && (
        <>
          <div className='text-center mb-4'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-[#1ea3ab] mb-2 tracking-tight'>
              Requesting a Quote
            </h2>
            <p className='text-lg md:text-xl text-gray-500 font-medium'>
              Get a quote for buying and selling cryptocurrencies.
            </p>
          </div>
          <div className='flex flex-col gap-8'>
            {/* ...existing code... */}
            <div className='flex flex-col gap-1 w-full'>
              {/* ...existing code for asset rows, selects, inputs, swap... */}
              {/* 1a linha: label */}
              <div className='flex w-full'>
                <Label className='text-base font-semibold text-[#1ea3ab]'>
                  You pay
                </Label>
              </div>
              {/* 2a linha: moeda, network, valor */}
              <div className='flex flex-row gap-2 w-full items-center'>
                {/* ...existing code for selects and input... */}
                <Select
                  value={sourceAsset.symbol}
                  onValueChange={(val) => {
                    const asset = assets.find((a) => a.symbol === val);
                    if (asset) setSourceAsset(asset);
                    setQuote(null);
                  }}
                >
                  {/* ...existing code... */}
                  <SelectTrigger className='glass-input px-3 py-2 text-base rounded-xl border-2 border-[#1ea3ab]/40 bg-[#f6fcfc] text-main min-w-[110px] focus:ring-2 focus:ring-[#1ea3ab] focus:border-[#1ea3ab] transition-colors hover:bg-[#e6f7f8] hover:border-[#1ea3ab] shadow-sm'>
                    <SelectValue>
                      {sourceAsset.type === 'crypto' ? (
                        <span className='inline-flex items-center gap-1'>
                          <TokenIcon
                            symbol={sourceAsset.symbol}
                            size={16}
                            color={
                              sourceAsset.symbol === 'ETH'
                                ? '#1ea3ab'
                                : undefined
                            }
                          />
                          <span className='text-base'>
                            {sourceAsset.name} ({sourceAsset.symbol})
                          </span>
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1'>
                          {sourceAsset.symbol === 'USD' && (
                            <US
                              title='United States'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          {sourceAsset.symbol === 'BRL' && (
                            <BR
                              title='Brazil'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          {sourceAsset.symbol === 'MXN' && (
                            <MX
                              title='Mexico'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          <span className='text-base'>
                            {sourceAsset.name} ({sourceAsset.symbol})
                          </span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className='bg-white/95 border-2 border-[#1ea3ab]/20 rounded-xl shadow-xl py-2'>
                    {assets.map((a) => (
                      <SelectItem
                        key={a.symbol}
                        value={a.symbol}
                        className='group px-3 py-2 rounded-lg cursor-pointer transition-colors data-[state=active]:bg-[#e6f7f8] data-[state=active]:text-[#1ea3ab] hover:bg-[#e6f7f8] hover:text-[#1ea3ab] flex items-center gap-2'
                      >
                        <span className='inline-flex items-center gap-1'>
                          {a.type === 'crypto' ? (
                            <TokenIcon
                              symbol={a.symbol}
                              size={20}
                              color={a.symbol === 'ETH' ? '#1ea3ab' : undefined}
                            />
                          ) : a.symbol === 'USD' ? (
                            <US
                              title='United States'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : a.symbol === 'BRL' ? (
                            <BR
                              title='Brazil'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : a.symbol === 'MXN' ? (
                            <MX
                              title='Mexico'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : null}
                          <span className='text-base'>
                            {a.name} ({a.symbol})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sourceAsset.type === 'crypto' &&
                  sourceAsset.networks.length > 0 && (
                    <Select
                      value={network}
                      onValueChange={(val) => setNetwork(val)}
                    >
                      <SelectTrigger className='glass-input px-3 py-2 text-base rounded-xl border-2 border-[#1ea3ab]/40 bg-[#f6fcfc] text-main min-w-[140px] focus:ring-2 focus:ring-[#1ea3ab] focus:border-[#1ea3ab] transition-colors hover:bg-[#e6f7f8] hover:border-[#1ea3ab] shadow-sm'>
                        <SelectValue>
                          {(() => {
                            const n = sourceAsset.networks.find(
                              (nw) => nw.id === network,
                            );
                            if (!n) return null;
                            return (
                              <span className='inline-flex items-center gap-1'>
                                <TokenIcon
                                  symbol={n.name}
                                  size={16}
                                  variant='mono'
                                  color='#1ea3ab'
                                />
                                <span className='text-base'>{n.name}</span>
                              </span>
                            );
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className='bg-white/95 border-2 border-[#1ea3ab]/20 rounded-xl shadow-xl py-2'>
                        {sourceAsset.networks.map((n) => (
                          <SelectItem
                            key={n.id}
                            value={n.id}
                            className='group px-3 py-2 rounded-lg cursor-pointer transition-colors data-[state=active]:bg-[#e6f7f8] data-[state=active]:text-[#1ea3ab] hover:bg-[#e6f7f8] hover:text-[#1ea3ab] flex items-center gap-2'
                          >
                            <span className='inline-flex items-center gap-1'>
                              <TokenIcon
                                symbol={n.name}
                                size={20}
                                variant='mono'
                                color='#1ea3ab'
                              />
                              <span className='text-base'>{n.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                <Input
                  type='number'
                  min={0}
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.target.value)}
                  className='glass-input w-32 text-right text-lg px-4 py-3 rounded-xl border-2 border-[#1ea3ab]/40 bg-white/90 focus:ring-2 focus:ring-[#1ea3ab] focus:border-[#1ea3ab] transition-colors hover:bg-[#e6f7f8]'
                  placeholder='Amount'
                />
              </div>
              {/* 3a linha: botão swap centralizado */}
              <div className='flex w-full justify-center my-2'>
                <Button
                  type='button'
                  variant='ghost'
                  className='h-12 w-12 rounded-full border-2 border-[#1ea3ab]/30 flex items-center justify-center bg-white/80 hover:bg-[#e6f7f8] shadow-md transition-colors'
                  onClick={handleSwap}
                >
                  <ArrowRightLeft className='w-7 h-7 text-[#1ea3ab]' />
                </Button>
              </div>
              {/* 4a linha: moeda, network, valor (destino) */}
              <div className='flex flex-row gap-2 w-full items-center'>
                <Select
                  value={targetAsset.symbol}
                  onValueChange={(val) => {
                    const asset = assets.find((a) => a.symbol === val);
                    if (asset) setTargetAsset(asset);
                    setQuote(null);
                  }}
                >
                  <SelectTrigger className='glass-input px-3 py-2 text-base rounded-xl border-2 border-[#1ea3ab]/40 bg-[#f6fcfc] text-main min-w-[110px] focus:ring-2 focus:ring-[#1ea3ab] focus:border-[#1ea3ab] transition-colors hover:bg-[#e6f7f8] hover:border-[#1ea3ab] shadow-sm'>
                    <SelectValue>
                      {targetAsset.type === 'crypto' ? (
                        <span className='inline-flex items-center gap-1'>
                          <TokenIcon
                            symbol={targetAsset.symbol}
                            size={16}
                            color={
                              targetAsset.symbol === 'ETH'
                                ? '#1ea3ab'
                                : undefined
                            }
                          />
                          <span className='text-base'>
                            {targetAsset.name} ({targetAsset.symbol})
                          </span>
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1'>
                          {targetAsset.symbol === 'USD' && (
                            <US
                              title='United States'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          {targetAsset.symbol === 'BRL' && (
                            <BR
                              title='Brazil'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          {targetAsset.symbol === 'MXN' && (
                            <MX
                              title='Mexico'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          )}
                          <span className='text-base'>
                            {targetAsset.name} ({targetAsset.symbol})
                          </span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className='bg-white/95 border-2 border-[#1ea3ab]/20 rounded-xl shadow-xl py-2'>
                    {assets.map((a) => (
                      <SelectItem
                        key={a.symbol}
                        value={a.symbol}
                        className='group px-3 py-2 rounded-lg cursor-pointer transition-colors data-[state=active]:bg-[#e6f7f8] data-[state=active]:text-[#1ea3ab] hover:bg-[#e6f7f8] hover:text-[#1ea3ab] flex items-center gap-2'
                      >
                        <span className='inline-flex items-center gap-1'>
                          {a.type === 'crypto' ? (
                            <TokenIcon
                              symbol={a.symbol}
                              size={20}
                              color={a.symbol === 'ETH' ? '#1ea3ab' : undefined}
                            />
                          ) : a.symbol === 'USD' ? (
                            <US
                              title='United States'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : a.symbol === 'BRL' ? (
                            <BR
                              title='Brazil'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : a.symbol === 'MXN' ? (
                            <MX
                              title='Mexico'
                              className='inline w-5 h-4 rounded-sm'
                            />
                          ) : null}
                          <span className='text-base'>
                            {a.name} ({a.symbol})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Network select removido conforme solicitado */}
                <Input
                  type='number'
                  min={0}
                  value={direction === 'receive' ? sourceAmount : ''}
                  onChange={(e) => {
                    setSourceAmount(e.target.value);
                    setQuote(null);
                  }}
                  className='glass-input w-32 text-right text-lg px-4 py-3 rounded-xl border-2 border-[#1ea3ab]/40 bg-white/90 focus:ring-2 focus:ring-[#1ea3ab] focus:border-[#1ea3ab] transition-colors hover:bg-[#e6f7f8]'
                  placeholder='Amount'
                  disabled={direction === 'pay'}
                />
              </div>
            </div>
            {/* Get Quote */}
            <Button
              className='bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-semibold shadow-lg mt-2 text-lg py-4 rounded-xl'
              onClick={getQuote}
              disabled={
                loading ||
                sourceAsset.symbol === targetAsset.symbol ||
                !isValidPair
              }
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <RefreshCw className='w-5 h-5 animate-spin' /> Requesting
                  quote...
                </span>
              ) : !isValidPair ? (
                'Select a FIAT and a CRYPTO asset'
              ) : (
                'Get Quote'
              )}
            </Button>
            {error && (
              <div className='text-red-500 text-center font-medium mt-2'>
                {error}
              </div>
            )}
          </div>
        </>
      )}

      {/* Step 1: Confirmação da troca */}
      {step === 1 && quote && (
        <div className='flex flex-col gap-8'>
          <div className='text-center mb-4'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-[#1ea3ab] mb-2 tracking-tight'>
              Confirm Exchange
            </h2>
            <p className='text-lg md:text-xl text-gray-500 font-medium'>
              Review and confirm your exchange details.
            </p>
          </div>
          <div className='mt-2 rounded-2xl border-2 border-[#1ea3ab]/30 bg-gradient-to-br from-[#e6f7f8] via-white to-[#d0f3f6] p-8 flex flex-col gap-4 shadow-xl'>
            <div className='flex items-center gap-5 mb-4 justify-center'>
              <Image
                src={sourceAsset.medium_image_url}
                alt={sourceAsset.symbol}
                width={40}
                height={40}
                className='w-10 h-10 rounded-full border-2 border-[#1ea3ab]/30'
              />
              <span className='font-bold text-[#1ea3ab] text-2xl'>
                {sourceAsset.symbol}
              </span>
              <Image
                src={targetAsset.medium_image_url}
                alt={targetAsset.symbol}
                width={40}
                height={40}
                className='w-10 h-10 rounded-full border-2 border-[#1ea3ab]/30'
              />
              <span className='font-bold text-[#1ea3ab] text-2xl'>
                {targetAsset.symbol}
              </span>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-10'>
              <div className='flex-1'>
                <Label className='text-sm text-[#1ea3ab] font-semibold'>
                  You pay
                </Label>
                <div className='font-mono text-xl text-[#1ea3ab] bg-white/70 rounded-xl px-4 py-2 mt-2 break-all shadow-inner border-2 border-dashed border-[#1ea3ab]/30'>
                  {sourceAsset.type === 'fiat'
                    ? Number(quote.source_amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : quote.source_amount}{' '}
                  {sourceAsset.symbol}
                </div>
              </div>
              <div className='flex-1'>
                <Label className='text-sm text-[#1ea3ab] font-semibold'>
                  You receive
                </Label>
                <div className='font-mono text-xl text-[#1ea3ab] bg-white/70 rounded-xl px-4 py-2 mt-2 break-all shadow-inner border-2 border-dashed border-[#1ea3ab]/30'>
                  {targetAsset.type === 'fiat'
                    ? Number(quote.target_amount_estimate).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )
                    : quote.target_amount_estimate}{' '}
                  {targetAsset.symbol}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3 mt-4'>
              <span className='text-base text-gray-500'>Rate:</span>
              <span className='font-mono text-lg text-[#1ea3ab]'>
                1 {sourceAsset.symbol} ≈ {quote.price} {targetAsset.symbol}
              </span>
              <span className='ml-auto text-base text-gray-400'>
                Valid for: {timer}s
              </span>
              <Button
                size='icon'
                variant='ghost'
                className='ml-2'
                onClick={getQuote}
                disabled={loading}
              >
                <RefreshCw className='w-6 h-6 text-[#1ea3ab]' />
              </Button>
            </div>
            <div className='flex gap-4 mt-6'>
              <Button
                className='flex-1 bg-gray-200 hover:bg-gray-300 text-[#1ea3ab] font-bold shadow text-lg py-4 rounded-xl'
                onClick={() => setStep(0)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                className='flex-1 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-bold shadow-lg text-lg py-4 rounded-xl'
                onClick={() => setStep(2)}
                disabled={timer === 0 || loading}
              >
                Confirm Exchange
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Sucesso */}
      {step === 2 && (
        <div className='flex flex-col items-center justify-center gap-8 min-h-[300px]'>
          <div className='flex flex-col items-center gap-2'>
            <div className='w-20 h-20 rounded-full bg-[#1ea3ab]/10 flex items-center justify-center border-4 border-[#1ea3ab] mb-2'>
              <svg
                width='40'
                height='40'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#1ea3ab'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <title>Exchange Confirmed Checkmark</title>
                <polyline points='20 6 10 18 4 12'></polyline>
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-[#1ea3ab]'>
              Exchange Confirmed!
            </h2>
            <p className='text-lg text-gray-500'>
              Your exchange was successfully confirmed.
            </p>
          </div>
          <Button
            className='mt-4 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-bold shadow-lg text-lg py-4 rounded-xl'
            onClick={() => {
              setStep(0);
              setQuote(null);
              setTimer(20);
            }}
          >
            New Exchange
          </Button>
        </div>
      )}
    </div>
  );
}
