'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsFetching } from '@tanstack/react-query';
import { listBankAccounts, deleteBankAccount } from '@/services/api-service';
import { SharedBankAccountModal } from '@/components/banking/SharedBankAccountModal';

const sharedWalletAssets = [
  { value: 'BRL', label: 'Real Brasileiro (BRL)', network: 'bitcoin' },
  { value: 'MXN', label: 'Peso Mexicano (MXN)', network: 'erc-20' },
  { value: 'USD', label: 'Dólar Americano (USD)', network: 'ripple' },
];

import { BankAccountCard } from '@/components/banking/BankAccountCard';
import { BankAccountModal } from '@/components/banking/BankAccountModal';
import { BankAccountDetailsCard } from '@/components/banking/BankAccountDetailsCard';
import { BanknoteArrowUp, PiggyBank, Plus } from 'lucide-react';

// Mocked data for select options
const fiatAssets = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
  { value: 'USD', label: 'Dólar Americano (USD)' },
  { value: 'BRL', label: 'Real Brasileiro (BRL)' },
];
const countries = [
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'United States', label: 'United States' },
];
const instantPaymentTypes = [
  { value: 'SPEI', label: 'SPEI (México)' },
  { value: 'PIX', label: 'PIX (Brasil)' },
];

// Gradientes criativos por moeda/país (tons mais leves e "americano" mais marcante)
const bankGradients: Record<string, string> = {
  // Brasil: verde, amarelo, azul (tons claros)
  BRL: 'from-green-100 via-yellow-50 to-blue-100',
  // México: verde, branco, vermelho (tons claros)
  MXN: 'from-green-100 via-white to-red-100',
  // EUA: azul, branco, vermelho (mais marcante, mas suave)
  USD: 'from-blue-200 via-white to-red-200',
};

// Mocked bank accounts (simulate API, com gradiente por asset)
const allGradients = [
  // Mais agressivos e saturados
  'from-green-400 via-yellow-300 to-blue-600',
  'from-green-500 via-red-300 to-red-600',
  'from-blue-500 via-white to-red-500',
  'from-pink-400 via-purple-400 to-blue-600',
  'from-yellow-400 via-orange-400 to-red-500',
  'from-sky-400 via-blue-400 to-indigo-600',
  'from-emerald-400 via-lime-400 to-green-600',
  'from-gray-400 via-slate-400 to-blue-400',
];
function randomGradient() {
  return allGradients[Math.floor(Math.random() * allGradients.length)];
}
const mockBankAccounts = [
  // SHARED (Recebimento)
  {
    id: 'sh-brl-1',
    bank_name: 'Flagship Instituição de Pagamento',
    bank_code: '',
    branch: '0000',
    account: '0000',
    bank_type: 'shared',
    type: 'shared',
    instant_payment:
      '00020126580014br.gov.bcb.pix01366eb61eb6-161c-4356-a4b6-8228ebbf0ab75204000053039865802BR5910Beta_Ramps6009Sao_Paulo62290525DEGtrh2wR9fmFLV0UsVw6rdIb63042230',
    instant_payment_type: 'PIX',
    country: 'Brazil',
    asset: 'BRL',
    city: '',
    state: '',
    postal_code: '',
    street_line: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Conta Compartilhada Flagship',
    gradient: randomGradient(),
  },
  {
    id: 'sh-mxn-1',
    bank_name: 'NVIO',
    bank_code: '',
    branch: '0000',
    account: '0000',
    bank_type: 'shared',
    type: 'shared',
    instant_payment: '710969000024615336',
    instant_payment_type: 'SPEI',
    country: 'Mexico',
    asset: 'MXN',
    city: '',
    state: '',
    postal_code: '',
    street_line: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Conta Compartilhada NVIO',
    gradient: randomGradient(),
  },
  {
    id: 'sh-usd-1',
    bank_name: 'Bridge',
    bank_code: '',
    branch: '101019644',
    account: '211214188608',
    bank_type: 'shared',
    type: 'shared',
    instant_payment: 'BRGGPBDNAJ8YPMR2FW6K',
    instant_payment_type: '',
    country: 'United States',
    asset: 'USD',
    city: 'Kansas City',
    state: 'MO',
    postal_code: '64108',
    street_line: '1801 Main St.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Conta Compartilhada Bridge',
    gradient: randomGradient(),
  },
  // EXTERNAL (Envio)
  {
    id: 'ex-brl-1',
    bank_name: 'Banco do Brasil',
    bank_code: '',
    branch: '12354',
    account: '9876514321',
    bank_type: 'external',
    type: 'external',
    instant_payment: '123456178900',
    instant_payment_type: 'PIX',
    country: 'BR',
    asset: 'BRL',
    city: 'São Paulo',
    state: 'SP',
    postal_code: '01000-000',
    street_line: 'Av. Paulista, 1000',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Minha Conta Pessoal',
    gradient: randomGradient(),
  },
  {
    id: 'ex-mxn-1',
    bank_name: 'BBVA Bancomer',
    bank_code: '',
    branch: '5678',
    account: '1234567890',
    bank_type: 'external',
    type: 'external',
    instant_payment: '123456789012',
    instant_payment_type: 'SPEI',
    country: 'Mexico',
    asset: 'MXN',
    city: 'Cidade do México',
    state: 'CDMX',
    postal_code: '01000',
    street_line: 'Av. Reforma, 200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Conta Pessoal BBVA',
    gradient: randomGradient(),
  },
  {
    id: 'ex-usd-1',
    bank_name: 'Bank of America',
    bank_code: '',
    branch: '001',
    account: '123456789',
    bank_type: 'external',
    type: 'external',
    instant_payment: '',
    instant_payment_type: '',
    country: 'United States',
    asset: 'USD',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    street_line: '5th Avenue, 200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    name: 'Conta Pessoal Bank of America',
    gradient: randomGradient(),
  },
];

// Hook para buscar contas bancárias da API real
function useBankAccounts() {
  return useQuery({
    queryKey: ['bankAccounts', 'api'],
    queryFn: async () => {
      const res = await listBankAccounts();
      // Adiciona gradiente visual temporário para cards
      return res.list.map((acc) => ({ ...acc, gradient: randomGradient() }));
    },
  });
}

// Card genérico para ausência de contas
function NoBankAccountCard({
  type,
  onAdd,
}: {
  type: 'shared' | 'external';
  onAdd: () => void;
}) {
  return (
    <div className='relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 via-white to-primary/5 border border-primary/20 flex flex-col items-center justify-center min-h-[220px] p-6'>
      <div className='absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-white/0 to-transparent' />
      <div className='z-10 flex flex-col items-center gap-3'>
        <div className='rounded-full bg-primary/10 p-4 flex items-center justify-center shadow'>
          <Plus className='w-8 h-8 text-primary' />
        </div>
        <span className='text-base text-main font-semibold tracking-wide text-center'>
          {type === 'shared'
            ? 'Nenhuma conta para depósito encontrada.'
            : 'Nenhuma conta para saque encontrada.'}
        </span>
        <Button
          className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          onClick={onAdd}
        >
          Adicionar conta {type === 'shared' ? 'de depósito' : 'de saque'}
        </Button>
      </div>
    </div>
  );
}

// Remover hooks de mock: useAddBankAccount, useEditBankAccount, useDeleteBankAccount
// (Apenas useBankAccounts real permanece)

export default function BankingAccountPage() {
  const [showSharedModal, setShowSharedModal] = useState(false);
  const queryClient = useQueryClient();
  const { data: bankAccounts = [], isLoading } = useBankAccounts();
  const isFetching = useIsFetching({ queryKey: ['bankAccounts', 'api'] }) > 0;
  // Removidos hooks de mock: useAddBankAccount, useEditBankAccount, useDeleteBankAccount
  const [showModal, setShowModal] = useState<
    false | { mode: 'add' } | { mode: 'edit'; account: any }
  >(false);
  const [deleteConfirm, setDeleteConfirm] = useState<null | any>(null);

  // Modal form handlers
  const handleAdd = () => setShowModal({ mode: 'add' });
  const handleAddShared = () => setShowSharedModal(true);
  const handleEdit = (account: any) => setShowModal({ mode: 'edit', account });
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = (account: any) => setDeleteConfirm(account);
  const confirmDelete = () => {
    if (deleteConfirm) {
      // Aqui você chamaria a função de deleção real da API
      // Exemplo: deleteBankAccount(deleteConfirm.id).then(() => {
      //   toast.success('Conta bancária deletada com sucesso!')
      //   setDeleteConfirm(null)
      // }).catch(err => {
      //   toast.error('Erro ao deletar conta bancária')
      // })
      setDeleteConfirm(null);
    }
  };

  return (
    <div className='content-height p-8 scroll-area bg-background'>
        <div className='max-w-5xl mx-auto space-y-8'>
          {/* Header */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
            <div className='flex flex-col md:flex-1 min-w-0'>
              <h1 className='text-2xl md:text-3xl font-bold text-main leading-tight'>
                Banking Accounts
              </h1>
              <span className='muted-text text-base md:text-lg leading-tight'>
                Manage your bank accounts for withdrawals and deposits
              </span>
            </div>
            <div className='flex flex-row gap-3 w-full md:w-auto mt-4 md:mt-0'>
              <Button
                onClick={handleAddShared}
                className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto'
              >
                <BanknoteArrowUp className='w-5 h-5 mr-2' /> Add Deposit Account
              </Button>
              <Button
                onClick={handleAdd}
                variant='outline'
                className='glass-button border-primary text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto'
              >
                <Plus className='w-5 h-5 mr-2' /> Add Withdraw Account
              </Button>
            </div>
          </div>

          {/* Cards grid - Dividido por tipo (shared/external) */}
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-16 gap-4'>
              <div className='w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
              <span className='text-lg text-primary font-bold tracking-wide'>
                Loading your Banking Accounts...
              </span>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 gap-4'>
              <div className='rounded-full bg-primary/10 p-6 flex items-center justify-center shadow'>
                <PiggyBank className='w-10 h-10 text-primary' />
              </div>
              <span className='text-lg text-main font-semibold tracking-wide'>
                No bank accounts found.
              </span>
              {/* Shared (Recebimento) - Quando não há contas, mostrar botão para adicionar */}
              <div className='w-full max-w-md mx-auto mt-6'>
                <NoBankAccountCard type='shared' onAdd={handleAddShared} />
              </div>
              <div className='w-full max-w-md mx-auto mt-6'>
                <NoBankAccountCard type='external' onAdd={handleAdd} />
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-10'>
              {/* Shared (Recebimento) */}
              <div>
                <h2 className='text-lg font-bold mb-3 flex items-center gap-2 px-1'>
                  <span className='inline-block w-3 h-3 rounded-full bg-green-500 mr-2' />{' '}
                  Accounts for Deposit (Shared)
                </h2>
                {/* Deduplica contas shared por instant_payment (ou id se não houver) */}
                {(() => {
                  const sharedAccounts = bankAccounts.filter((a: any) => a.bank_type === 'shared');
                  // Deduplica pelo instant_payment (ou id como fallback)
                  const deduped = Array.from(
                    new Map(
                      sharedAccounts.map(acc => [acc.instant_payment || acc.id, acc])
                    ).values()
                  );
                  if (deduped.length === 0) {
                    return (
                      <div>
                        <NoBankAccountCard type='shared' onAdd={handleAddShared} />
                      </div>
                    );
                  }
                  return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {deduped.map((account: any) => (
                        <BankAccountCard
                          key={account.id}
                          account={account}
                          onCopy={(text: string) => {
                            navigator.clipboard.writeText(text);
                            toast.success('Copiado!');
                          }}
                          onView={() => handleEdit(account)}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
              {/* External (Envio) */}
              <div>
                <h2 className='text-lg font-bold mb-3 flex items-center gap-2 px-1'>
                  <span className='inline-block w-3 h-3 rounded-full bg-blue-500 mr-2' />{' '}
                  Accounts for Withdraw (External)
                </h2>
                {bankAccounts.filter((a: any) => a.bank_type === 'external').length === 0 ? (
                  <div>
                    <NoBankAccountCard type='external' onAdd={handleAdd} />
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {bankAccounts
                      .filter((a: any) => a.bank_type === 'external')
                      .map((account: any) => (
                        <BankAccountCard
                          key={account.id}
                          account={account}
                          onCopy={(text: string) => {
                            navigator.clipboard.writeText(text);
                            toast.success('Copiado!');
                          }}
                          onView={() => handleEdit(account)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Shared Bank Account - sempre presente para garantir abertura */}
          <SharedBankAccountModal
            open={showSharedModal}
            onOpenChange={setShowSharedModal}
            onSuccess={async () => {
              setShowSharedModal(false);
              await queryClient.invalidateQueries({
                queryKey: ['bankAccounts', 'api'],
              });
              toast.success('Conta compartilhada adicionada!');
            }}
          />

          {/* Modal add/edit */}
          {/* Modal add/edit e detalhes */}
          <Dialog open={!!showModal} onOpenChange={handleCloseModal}>
            <DialogContent className='glass-card-enhanced max-w-md'>
              {showModal && showModal.mode === 'edit' && showModal.account && (
                <BankAccountDetailsCard
                  account={showModal.account}
                  onDelete={async (account) => {
                    // Chama a deleção real e faz refetch
                    try {
                      await deleteBankAccount(account.id);
                      await queryClient.invalidateQueries({
                        queryKey: ['bankAccounts', 'api'],
                      });
                      setShowModal(false);
                      toast.success('Bank account deleted!');
                    } catch (_err) {
                      toast.error('Error deleting bank account.');
                    }
                  }}
                />
              )}
              {showModal && showModal.mode === 'add' && (
                <BankAccountModal
                  open={!!showModal}
                  onOpenChange={handleCloseModal}
                  initialData={undefined}
                  onSuccess={handleCloseModal}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Delete confirmation modal */}
          <Dialog
            open={!!deleteConfirm}
            onOpenChange={() => setDeleteConfirm(null)}
          >
            <DialogContent className='glass-card-enhanced max-w-sm'>
              <DialogHeader>
                <DialogTitle className='text-lg font-bold text-main'>
                  Confirmar deleção
                </DialogTitle>
              </DialogHeader>
              <div className='py-4 text-main text-center'>
                Tem certeza que deseja apagar esta conta bancária? Esta ação não
                pode ser desfeita.
              </div>
              <div className='flex gap-3 justify-end pt-2'>
                <Button
                  variant='outline'
                  className='glass-button flex-1'
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant='destructive'
                  className='bg-red-600 hover:bg-red-700 text-white font-semibold flex-1'
                  onClick={confirmDelete}
                >
                  Apagar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
  );
}
