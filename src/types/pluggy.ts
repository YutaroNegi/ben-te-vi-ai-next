interface Connector {
  id: number;
  name: string;
  primaryColor: string;
  institutionUrl: string;
  country: string;
  type: string;
  credentials: {
    validation: string;
    validationMessage: string;
    label: string;
    name: string;
    type: string;
    placeholder: string;
    optional: boolean;
  }[];
  imageUrl: string;
  hasMFA: boolean;
  oauth: boolean;
  health: {
    status: string;
    stage: string | null;
  };
  products: string[];
  createdAt: string;
  isSandbox: boolean;
  isOpenFinance: boolean;
  updatedAt: string;
  supportsPaymentInitiation: boolean;
  supportsScheduledPayments: boolean;
  supportsSmartTransfers: boolean;
  supportsBoletoManagement: boolean;
}

export interface ItemData {
  id: string;
  pluggy_item_id: string;
  connector: Connector;
  createdAt: string;
  updatedAt: string;
  status: string;
  executionStatus: string;
  lastUpdatedAt: string;
  webhookUrl: string | null;
  error: string | null;
  clientUserId: string | null;
  consecutiveFailedLoginAttempts: number;
  statusDetail: string | null;
  parameter: string | null;
  userAction: string | null;
  nextAutoSyncAt: string | null;
  autoSyncDisabledAt: string | null;
  consentExpiresAt: string | null;
  products: string[];
  oauthRedirectUri: string | null;
}
export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  imported: boolean;
  date: string;
  pluggy_installments_reference?: string;
  installmentNumber?: number;
  creditCardMetadata?: {
    installmentNumber?: number;
    totalInstallments?: number;
  };
}
export interface TransactionsTableProps {
  transactions: Transaction[];
}
