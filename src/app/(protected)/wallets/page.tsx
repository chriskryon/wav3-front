'use client';

import { useState } from 'react';
import {
  Plus,
  Copy,
  HandCoins,
  Loader2,
  Wallet2,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Wallet } from '@/entities/types';
import {
  TokenBTC,
  TokenETH,
  TokenXRP,
  TokenUSDT,
} from '@web3icons/react';
import { WalletCard } from '@/components/wallet-card';
import { ExternalWallet } from '@/components/wallets/ExternalWallet';
import { SharedWallet } from '@/components/wallets/SharedWallet';
import { Label } from '@/components/ui/label';
import { deleteWallet, listWallets, registerExternalWallet, registerSharedWallet } from '@/services/wallet-api-service';

export default function WalletsPage() {
  const [showNewWalletModal, setShowNewWalletModal] = useState<
    false | 'external' | 'deposit'
  >(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [walletToDelete, setWalletToDelete] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const queryClient = useQueryClient();
  // Mapeamento asset -> network
  const assetNetworkMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'erc-20',
    XRP: 'ripple',
    USDT: 'tron',
  };

  // Mapeamento asset -> ícone
  const assetIcons: Record<string, React.ElementType> = {
    BTC: TokenBTC,
    ETH: TokenETH,
    XRP: TokenXRP,
    USDT: TokenUSDT,
  };

  // Paleta de gradientes por asset (usada para fallback no modal)
  const assetGradients: Record<string, string> = {
    BTC: 'from-orange-400 to-yellow-500',
    ETH: 'from-blue-500 to-purple-600',
    XRP: 'from-gray-700 to-blue-400',
    USDT: 'from-green-400 to-emerald-500',
  };

  // Estados do formulário de nova wallet
  const [newWallet, setNewWallet] = useState({
    name: '',
    asset: '',
    address: '',
    network: '',
  });

  // Atualiza asset e network juntos
  const handleAssetChange = (value: string) => {
    setNewWallet((prev) => ({
      ...prev,
      asset: value,
      network: assetNetworkMap[value] || '',
    }));
  };

  // Estados do formulário de shared wallet
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

  // Busca wallets com React Query
  const {
    data: walletListData = [],
    isLoading: loadingWallets,
    error: walletsError,
  } = useQuery<Wallet[], Error>({
    queryKey: ['wallets'],
    queryFn: async () => {
      const result = await listWallets();
      return result?.list || [];
    },
    retry: false,
  });

  // Handle unauthorized error after the hook
  if (
    walletsError &&
    (walletsError as any)?.response?.status === 401 &&
    !isUnauthorized
  ) {
    setIsUnauthorized(true);
  }

  // Mutação para adicionar wallet
  const addWalletMutation = useMutation({
    mutationFn: registerExternalWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  // Mutação para deletar wallet
  const deleteWalletMutation = useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  // Agrupa wallets por tipo
  const groupedWallets = (walletListData as Wallet[]).reduce<
    Record<string, Wallet[]>
  >((acc, wallet) => {
    acc[wallet.wallet_type] = acc[wallet.wallet_type] || [];
    acc[wallet.wallet_type].push(wallet);
    return acc;
  }, {});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newWallet.name ||
      !newWallet.asset ||
      !newWallet.address ||
      !newWallet.network
    ) {
      toast.error('Fill all fields!');
      return;
    }
    addWalletMutation.mutate(newWallet, {
      onSuccess: (result: any) => {
        if (result.message) {
          if (result.message.toLowerCase().includes('duplicate')) {
            toast.error('Wallet address already registered.');
          } else if (
            result.message === 'Falha ao registrar wallet na Beta Ramps'
          ) {
            toast.error('Failed to register wallet in Beta Ramps.');
          } else {
            toast.error(result.message);
          }
        } else if (result.id) {
          toast.success('Wallet registered successfully!');
          setShowNewWalletModal(false);
          setNewWallet({ name: '', asset: '', address: '', network: '' });
        } else {
          toast.error('Unexpected error registering wallet');
        }
      },
      onError: () => toast.error('Error registering wallet'),
    });
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
        toast.success('Shared wallet created successfully!');
        queryClient.invalidateQueries({ queryKey: ['wallets'] });
        return;
      }

      // Erro de validação (400)
      if (result.message && Array.isArray(result.details)) {
        const detailMsg = result.details.map((d: any) => d.message).join(', ');
        toast.error(detailMsg || 'Validation error when registering wallet.');
        return;
      }

      // Mensagem de erro simples (400 ou 404)
      if (result.message) {
        toast.error(result.message);
        return;
      }

      // Erro inesperado (500)
      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Fallback
      toast.error('Unexpected error registering shared wallet.');
    } catch (err: any) {
      toast.error(err?.message || 'Error registering shared wallet.');
    } finally {
      setIsRegisteringShared(false);
    }
  };

  const handleDeleteWallet = async () => {
    if (!selectedWallet) return;
    setDeleting(true);
    deleteWalletMutation.mutate(selectedWallet.id, {
      onSuccess: () => {
        toast.success('Wallet deleted successfully!');
        setSelectedWallet(null);
        setShowDeleteConfirm(false);
      },
      onError: () => toast.error('Error deleting wallet'),
      onSettled: () => setDeleting(false),
    });
  };

  return (
    <div className='content-height p-8 scroll-area bg-background'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-8'>
          {/* Título e subtítulo juntos no mobile */}
          <div className='flex flex-col md:flex-1 min-w-0'>
            <div className='flex flex-col md:block'>
              <h1 className='text-2xl md:text-3xl font-bold text-main leading-tight md:whitespace-normal whitespace-nowrap md:mb-0 mb-1'>
                Crypto Wallets
              </h1>
              <span className='muted-text text-base md:text-lg md:ml-2 leading-tight whitespace-nowrap'>
                Manage your cryptocurrency wallets
              </span>
            </div>
          </div>
          {/* Botões só ao lado em telas md+ */}
          <div className='hidden md:flex flex-row gap-3 w-auto'>
            <Button
              onClick={() => setShowNewWalletModal('external')}
              className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <BanknoteArrowUp className='w-4 h-4 mr-2' />
              Add Withdraw Wallet
            </Button>
            <Button
              variant='outline'
              onClick={() => setShowNewWalletModal('deposit')}
              className='glass-button border-primary text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <BanknoteArrowDown className='w-4 h-4 mr-2' />
              Add Deposit Wallet
            </Button>
          </div>
        </div>
        {/* Botões lado a lado no mobile */}
        <div className='flex flex-row gap-3 w-full md:hidden mt-2'>
          <Button
            onClick={() => setShowNewWalletModal('external')}
            className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-1/2 flex flex-col items-center justify-center py-4 rounded-2xl active:scale-95 focus:ring-2 focus:ring-primary/40'
            style={{ minHeight: 80 }}
          >
            <Plus className='w-7 h-7 mb-1' />
            <span className='text-base font-semibold'>Payments</span>
          </Button>
          <Button
            variant='outline'
            onClick={() => setShowNewWalletModal('deposit')}
            className='glass-button border-primary text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-1/2 flex flex-col items-center justify-center py-4 rounded-2xl active:scale-95 focus:ring-2 focus:ring-primary/20'
            style={{ minHeight: 80 }}
          >
            <HandCoins className='w-7 h-7 mb-1' />
            <span className='text-base font-semibold'>Deposits</span>
          </Button>
        </div>

        {/* Wallets Grid - Agrupado por tipo, responsivo */}
        {isUnauthorized ? (
          <div className='flex flex-col items-center justify-center py-24 gap-6'>
            <Wallet2 className='w-14 h-14 text-primary mb-2' />
            <p className='text-xl text-center font-bold text-main'>
              You must complete KYC to create wallets
            </p>
            <p className='text-base text-center text-muted-foreground max-w-md'>
              Go to your profile and submit your KYC to enable wallet registration.
            </p>
            <Button
              variant='outline'
              className='glass-button mt-2'
              onClick={() => { window.location.href = '/profile'; }}
            >
              Go to my profile
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-8'>
            {loadingWallets ? (
              <div className='flex flex-col items-center justify-center py-16 gap-4'>
                <Loader2 className='w-12 h-12 text-primary animate-spin' />
                <span className='text-lg text-primary font-bold tracking-wide'>
                  Loading wallets...
                </span>
              </div>
            ) : Object.keys(groupedWallets).length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16 gap-4'>
                <div className='rounded-full bg-primary/10 p-6 flex items-center justify-center shadow'>
                  <Wallet2 className='w-10 h-10 text-primary' />
                </div>
                <span className='text-lg text-main font-semibold tracking-wide'>
                  No wallets found.
                </span>
                <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                  <Button
                    onClick={() => {
                      setShowNewWalletModal('external');
                      toast.info('Fill the form to add a withdraw wallet.');
                    }}
                    className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    <BanknoteArrowUp className='w-4 h-4 mr-2' />
                    Add Withdraw Wallet
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setShowNewWalletModal('deposit');
                      toast.info('Fill the form to add a deposit wallet.');
                    }}
                    className='glass-button border-primary text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    <BanknoteArrowDown className='w-4 h-4 mr-2' />
                    Add Deposit Wallet
                  </Button>
                </div>
              </div>
            ) : (
              Object.entries(groupedWallets).map(([type, wallets]) => (
                <div key={type}>
                  <h2 className='text-lg font-bold mb-3 flex items-center gap-2 px-1'>
                    {type === 'external' ? (
                      <>
                        <Wallet2 className='w-5 h-5 text-primary' /> Wallets for Withdrawal
                      </>
                    ) : (
                      <>
                        <HandCoins className='w-5 h-5 text-green-600' /> Wallets for Deposits
                      </>
                    )}
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {(wallets as typeof walletListData).map((wallet) => (
                      <WalletCard
                        key={wallet.id}
                        wallet={wallet}
                        type={type as 'external' | 'shared'}
                        onCopy={copyToClipboard}
                        onView={setSelectedWallet}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* New Wallet Modal */}
        <Dialog
          open={!!showNewWalletModal}
          onOpenChange={() => setShowNewWalletModal(false)}
        >
          <DialogContent className='glass-card-enhanced max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-main'>
                {showNewWalletModal === 'external'
                  ? 'Add Wallet for Payments'
                  : 'Receive Cryptocurrency'}
              </DialogTitle>
            </DialogHeader>
            {showNewWalletModal === 'external' ? (
              <ExternalWallet
                newWallet={newWallet}
                assetNetworkMap={assetNetworkMap}
                assetIcons={assetIcons}
                onAssetChange={handleAssetChange}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setNewWallet((prev) => ({ ...prev, [name]: value }));
                }}
                onSubmit={handleAddWallet}
                isLoading={addWalletMutation.isPending}
                onCancel={() => setShowNewWalletModal(false)}
              />
            ) : (
              <SharedWallet
                sharedWallet={sharedWallet}
                assetNetworkOptions={assetNetworkOptions}
                sharedResult={sharedResult}
                isRegisteringShared={isRegisteringShared}
                onAssetChange={handleSharedAssetChange}
                onNetworkChange={(v) =>
                  setSharedWallet((prev) => ({ ...prev, network: v }))
                }
                onSubmit={handleRegisterShared}
                onCancel={() => setShowNewWalletModal(false)}
                onCopy={copyToClipboard}
              />
            )}
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
                  className={`relative h-60 bg-linear-to-br ${selectedWallet.gradient || assetGradients[selectedWallet.asset] || 'from-gray-400 to-gray-600'} p-6 rounded-xl overflow-hidden`}
                >
                  <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-4 right-4 w-12 h-12 rounded-full bg-white/30'></div>
                    <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
                  </div>
                  <div className='relative z-10 h-full flex flex-col justify-between text-white'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-lg'>
                          {selectedWallet.name ||
                            selectedWallet.asset + ' Wallet'}
                        </h3>
                        <p className='text-sm opacity-90 capitalize'>
                          {selectedWallet.network} Network
                        </p>
                        <span className='inline-block text-xs bg-black/30 rounded px-2 py-0.5 mt-1 font-semibold uppercase tracking-wider'>
                          {selectedWallet.wallet_type === 'external'
                            ? 'Withdraw'
                            : 'Deposit'}
                        </span>
                      </div>
                      <Wallet2 className='w-8 h-8 opacity-80' />
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>Asset</span>
                        <span className='font-bold text-lg flex items-center gap-2'>
                          {assetIcons[selectedWallet.asset] && (
                            <span className='inline-flex items-center'>
                              <span className='mr-1'>
                                {(() => {
                                  const Icon = assetIcons[selectedWallet.asset];
                                  return Icon ? (
                                    <Icon className='w-5 h-5' />
                                  ) : null;
                                })()}
                              </span>
                              {selectedWallet.asset}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>Network</span>
                        <span className='font-mono text-xs'>
                          {selectedWallet.network}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm opacity-80'>Created at</span>
                        <span className='font-mono text-xs'>
                          {new Date(selectedWallet.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Full Address */}
                <div className='glass-item p-4'>
                  <Label className='muted-text text-sm'>Address</Label>
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
                  {selectedWallet.address_tag &&
                    selectedWallet.address_tag.length > 0 && (
                      <div className='mt-2'>
                        <Label className='muted-text text-xs'>
                          Address Tag
                        </Label>
                        <code className='ml-2 p-1 bg-surface rounded text-xs font-mono border border-black/10'>
                          {selectedWallet.address_tag}
                        </code>
                      </div>
                    )}
                </div>
                {/* Action Buttons */}
                <div className='flex justify-end'>
                  {selectedWallet.wallet_type === 'external' && (
                    <Button
                      variant='destructive'
                      className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6'
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de confirmação de deleção */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className='glass-card-enhanced max-w-sm'>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold text-main'>
                Confirm delete
              </DialogTitle>
            </DialogHeader>
            <div className='py-4 text-main text-center'>
              Are you sure you want to delete this wallet? This action cannot be undone.
            </div>
            <div className='flex gap-3 justify-end pt-2'>
              <Button
                variant='outline'
                className='glass-button flex-1'
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                className='bg-red-600 hover:bg-red-700 text-white font-semibold flex-1'
                onClick={handleDeleteWallet}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                ) : null}
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
