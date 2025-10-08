'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HandCoins, Loader2, Copy, BanknoteArrowDown, CheckCircle } from 'lucide-react';
import { TokenBTC, TokenETH, TokenXRP, TokenUSDT } from '@web3icons/react';
import { registerSharedWallet } from '@/services/wallet-api-service';
import { toast } from 'sonner';

interface CreateDepositWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDepositWalletModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateDepositWalletModalProps) {
  const [sharedWallet, setSharedWallet] = useState({
    asset: '',
    network: '',
  });
  const [sharedResult, setSharedResult] = useState<any>(null);
  const [isRegisteringShared, setIsRegisteringShared] = useState(false);

  // Mapeamento asset -> networks permitidas
  const assetNetworkOptions: Record<string, string[]> = {
    BTC: ['bitcoin'],
    ETH: ['erc-20'],
    XRP: ['ripple'],
    USDT: ['tron'],
  };

  const handleSharedAssetChange = (value: string) => {
    setSharedWallet((prev) => ({
      ...prev,
      asset: value,
      network: assetNetworkOptions[value]?.[0] || '',
    }));
  };

  const handleRegisterShared = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedWallet.asset || !sharedWallet.network) {
      toast.error('Select asset and network!');
      return;
    }
    setIsRegisteringShared(true);
    setSharedResult(null);
    
    try {
      const result = await registerSharedWallet(sharedWallet);
      setSharedResult(result);

      // Sucesso: carteira compartilhada criada
      if (result.id && result.wallet_type === 'shared') {
        toast.success('Deposit wallet created successfully!');
        // NÃO chamar onSuccess aqui para manter o modal aberto
        // if (onSuccess) onSuccess();
        return;
      }

      // Erro de validação (400)
      if (result.message && Array.isArray(result.details)) {
        const detailMsg = result.details.map((d: any) => d.message).join(', ');
        toast.error(`Validation error: ${detailMsg}`);
        return;
      }

      // Mensagem de erro simples (400 ou 404)
      if (result.message) {
        toast.error(result.message);
        return;
      }

      // Erro inesperado (500)
      if (result.error) {
        toast.error(`Server error: ${result.error}`);
        return;
      }

      // Fallback
      toast.error('Unexpected error creating deposit wallet.');
    } catch (err: any) {
      toast.error(err?.message || 'Error creating deposit wallet.');
    } finally {
      setIsRegisteringShared(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const handleClose = () => {
    // Reset estados ao fechar
    setSharedWallet({ asset: '', network: '' });
    setSharedResult(null);
    setIsRegisteringShared(false);
    onOpenChange(false);
  };

  const handleDone = () => {
    // Chama onSuccess se a wallet foi criada com sucesso
    if (sharedResult?.id && onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  const renderAssetIcon = (asset: string) => {
    const iconMap: Record<string, any> = {
      BTC: TokenBTC,
      ETH: TokenETH,
      XRP: TokenXRP,
      USDT: TokenUSDT,
    };
    
    const IconComponent = iconMap[asset];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return <HandCoins className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-lg bg-white border border-gray-200 rounded-xl shadow-xl'>
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <BanknoteArrowDown className='w-5 h-5 text-[#1ea3ab]' />
            Create Deposit Wallet
          </DialogTitle>
          <p className='text-sm text-gray-600 mt-1'>
            Generate a new wallet address to receive cryptocurrency deposits
          </p>
        </DialogHeader>

        <div className="pt-4">
          {/* Se já temos resultado, mostra as informações da carteira criada */}
          {sharedResult?.address ? (
            <div className='space-y-4'>
              <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className='text-lg font-semibold text-green-800 mb-2'>
                  Wallet Created Successfully!
                </h3>
                <p className='text-sm text-green-600'>
                  Your {sharedResult.asset} wallet is ready for deposits
                </p>
              </div>
              
              <div className='space-y-3'>
                <div>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Asset</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {renderAssetIcon(sharedResult.asset)}
                    <p className='text-sm font-semibold text-gray-900'>{sharedResult.asset}</p>
                  </div>
                </div>
                
                <div>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Network</Label>
                  <p className='text-sm font-semibold text-gray-900 mt-1'>{sharedResult.network}</p>
                </div>
                
                <div>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Wallet Address</Label>
                  <div className='flex items-center gap-2 mt-1'>
                    <code className='flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono text-gray-900 truncate' title={sharedResult.address}>
                      {sharedResult.address.length > 32 
                        ? `${sharedResult.address.substring(0, 32)}...` 
                        : sharedResult.address
                      }
                    </code>
                    <Button
                      size='sm'
                      onClick={() => copyToClipboard(sharedResult.address)}
                      className='bg-[#1ea3ab] hover:bg-[#188a91] text-white px-3 py-2 rounded-lg border border-[#1ea3ab] transition-colors'
                    >
                      <Copy className='w-4 h-4' />
                    </Button>
                  </div>
                  {sharedResult.address_tag && (
                    <div className='mt-2'>
                      <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Address Tag</Label>
                      <code className='block mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono text-gray-900'>
                        {sharedResult.address_tag}
                      </code>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleDone}
                className='w-full bg-[#1ea3ab] hover:bg-[#188a91] text-white font-medium py-3 rounded-lg border border-[#1ea3ab] transition-colors'
              >
                Done
              </Button>
            </div>
          ) : (
            /* Formulário para criar nova carteira compartilhada */
            <form className='space-y-4 flex flex-col justify-center' onSubmit={handleRegisterShared}>
              {/* Asset Select */}
              <div>
                <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Asset</Label>
                <div className='relative flex items-center mt-1'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none'>
                    <HandCoins className='w-4 h-4 text-gray-400' />
                  </span>
                  <Select value={sharedWallet.asset} onValueChange={handleSharedAssetChange}>
                    <SelectTrigger className='bg-white border border-gray-300 rounded-lg pl-10 py-3 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab] transition-colors'>
                      <SelectValue placeholder='Select asset' />
                    </SelectTrigger>
                    <SelectContent className='bg-white border border-gray-200 rounded-lg shadow-lg'>
                      <SelectItem value='BTC' className='hover:bg-gray-50 focus:bg-gray-50'>
                        <div className="flex items-center gap-2">
                          <TokenBTC className="w-4 h-4" />
                          Bitcoin (BTC)
                        </div>
                      </SelectItem>
                      <SelectItem value='ETH' className='hover:bg-gray-50 focus:bg-gray-50'>
                        <div className="flex items-center gap-2">
                          <TokenETH className="w-4 h-4" />
                          Ethereum (ETH)
                        </div>
                      </SelectItem>
                      <SelectItem value='XRP' className='hover:bg-gray-50 focus:bg-gray-50'>
                        <div className="flex items-center gap-2">
                          <TokenXRP className="w-4 h-4" />
                          Ripple (XRP)
                        </div>
                      </SelectItem>
                      <SelectItem value='USDT' className='hover:bg-gray-50 focus:bg-gray-50'>
                        <div className="flex items-center gap-2">
                          <TokenUSDT className="w-4 h-4" />
                          Tether (USDT)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Network Select - só aparece se asset estiver selecionado */}
              {sharedWallet.asset && (
                <div>
                  <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Network</Label>
                  <div className='relative flex items-center mt-1'>
                    <Select value={sharedWallet.network} onValueChange={(value) => setSharedWallet(prev => ({ ...prev, network: value }))}>
                      <SelectTrigger className='bg-white border border-gray-300 rounded-lg py-3 focus:border-[#1ea3ab] focus:ring-1 focus:ring-[#1ea3ab] transition-colors'>
                        <SelectValue placeholder='Select network' />
                      </SelectTrigger>
                      <SelectContent className='bg-white border border-gray-200 rounded-lg shadow-lg'>
                        {assetNetworkOptions[sharedWallet.asset]?.map((network) => (
                          <SelectItem key={network} value={network} className='hover:bg-gray-50 focus:bg-gray-50'>
                            {network.charAt(0).toUpperCase() + network.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  className='flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium py-3 rounded-lg'
                  disabled={isRegisteringShared}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-[#1ea3ab] hover:bg-[#188a91] text-white font-medium py-3 rounded-lg border border-[#1ea3ab] transition-colors'
                  disabled={isRegisteringShared || !sharedWallet.asset || !sharedWallet.network}
                >
                  {isRegisteringShared ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      Creating...
                    </>
                  ) : (
                    'Create Deposit Wallet'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
