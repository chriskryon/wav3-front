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
import { deleteWallet, listWallets, registerExternalWallet, registerSharedWallet } from '@/services/wallet-api-service';
import Wav3Loading from '@/components/loading-wav3';

export default function WalletsPage() {
  const [showNewWalletModal, setShowNewWalletModal] = useState<
    false | 'external' | 'deposit'
  >(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
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
            <span className='text-base font-semibold'>Withdrawals</span>
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
              <Wav3Loading />
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
          <DialogContent className='max-w-lg bg-white border border-gray-200 rounded-lg shadow-xl'>
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                {showNewWalletModal === 'external' ? (
                  <>
                    <BanknoteArrowUp className='w-5 h-5 text-[#1ea3ab]' />
                    Add Withdrawal Wallet
                  </>
                ) : (
                  <>
                    <BanknoteArrowDown className='w-5 h-5 text-[#1ea3ab]' />
                    Create Deposit Wallet
                  </>
                )}
              </DialogTitle>
              <p className='text-sm text-gray-600 mt-1'>
                {showNewWalletModal === 'external'
                  ? 'Add an external wallet address for cryptocurrency withdrawals'
                  : 'Generate a new wallet address to receive cryptocurrency deposits'
                }
              </p>
            </DialogHeader>
            <div className="pt-4">
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
            </div>
          </DialogContent>
        </Dialog>

        {/* Wallet Details Modal */}
        <Dialog
          open={!!selectedWallet}
          onOpenChange={() => setSelectedWallet(null)}
        >
          <DialogContent className='max-w-lg bg-white border border-gray-200 rounded-lg shadow-xl'>
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                <Wallet2 className='w-5 h-5 text-[#1ea3ab]' />
                Wallet Details
              </DialogTitle>
              <p className='text-sm text-gray-600 mt-1'>
                View and manage your wallet information
              </p>
            </DialogHeader>
            {selectedWallet && (
              <div className='pt-4 space-y-4'>
                {/* Wallet Info Card */}
                <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg text-gray-900'>
                        {selectedWallet.name || `${selectedWallet.asset} Wallet`}
                      </h3>
                      <div className='flex items-center gap-2 mt-1'>
                        {assetIcons[selectedWallet.asset] && (
                          <span className='inline-flex items-center'>
                            {(() => {
                              const Icon = assetIcons[selectedWallet.asset];
                              return Icon ? <Icon className='w-4 h-4' /> : null;
                            })()}
                          </span>
                        )}
                        <span className='text-sm font-medium text-gray-700'>
                          {selectedWallet.asset}
                        </span>
                        <span className='text-xs px-2 py-1 bg-white rounded border border-gray-300 text-gray-600'>
                          {selectedWallet.network}
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <span className={`inline-block text-xs px-2 py-1 rounded font-medium uppercase tracking-wide ${
                        selectedWallet.wallet_type === 'external'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedWallet.wallet_type === 'external' ? 'Withdraw' : 'Deposit'}
                      </span>
                      <p className='text-xs text-gray-500 mt-1'>
                        {new Date(selectedWallet.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className='space-y-3'>
                  <div>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2'>
                      Wallet Address
                    </div>
                    <div className='flex items-center gap-2'>
                      <code className='flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-gray-900 break-all'>
                        {selectedWallet.address}
                      </code>
                      <Button
                        size='sm'
                        onClick={() => copyToClipboard(selectedWallet.address)}
                        className='bg-[#1ea3ab] hover:bg-[#188a91] text-white p-2 rounded-lg border border-[#1ea3ab] transition-colors shrink-0'
                      >
                        <Copy className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  {selectedWallet.address_tag && selectedWallet.address_tag.length > 0 && (
                    <div>
                      <div className='text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2'>
                        Address Tag / Memo
                      </div>
                      <code className='block p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-gray-900'>
                        {selectedWallet.address_tag}
                      </code>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
                  <Button
                    variant='outline'
                    onClick={() => setSelectedWallet(null)}
                    className='bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors px-4 py-2 rounded-lg'
                  >
                    Close
                  </Button>
                  {selectedWallet.wallet_type === 'external' && (
                    <Button
                      variant='destructive'
                      className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg border border-red-600 transition-colors'
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Wallet
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className='max-w-md bg-white border border-gray-200 rounded-lg shadow-xl'>
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className='text-xl font-semibold text-red-700 flex items-center gap-2'>
                <Wallet2 className='w-5 h-5 text-red-600' />
                Delete Wallet
              </DialogTitle>
              <p className='text-sm text-gray-600 mt-1'>
                This action cannot be undone
              </p>
            </DialogHeader>
            <div className='pt-4 space-y-4'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <p className='text-sm text-red-800 font-medium mb-2'>
                  Are you sure you want to delete this wallet?
                </p>
                <p className='text-xs text-red-600'>
                  This will permanently remove the wallet from your account. Any pending transactions may be affected.
                </p>
              </div>
              
              <div className='flex gap-3 pt-2'>
                <Button
                  variant='outline'
                  className='flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium py-2 rounded-lg'
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  className='bg-red-600 hover:bg-red-700 text-white font-medium flex-1 py-2 rounded-lg border border-red-600 transition-colors'
                  onClick={handleDeleteWallet}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      Deleting...
                    </>
                  ) : (
                    'Delete Wallet'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
