export type ExpenseType = "expense" | "income";

export interface CategoryOption {
  value: string;
  label: string;
}

export interface Installment {
  id: string;
  expense_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  paid: boolean;
  paid_at?: string | null;
  total_installments: number;
  total_purchase_amount: number;
  installment_type: string;
  expense: {
    id: string;
    category_id: string;
    name: string;
    description?: string;
    user_id: string;
    created_at: string;
    type: ExpenseType;
  };
}

export interface ExpenseData {
  user_id: string;
  name: string;
  amount: number;
  category_id: string;
  description: string | null;
  date: string;
  installments: number;
  type: ExpenseType;
  pluggy_transaction_id?: string | null;
  pluggy_installments_reference?: string | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  type: ExpenseType;
}

export interface CategoryBody {
  name: string;
  description: string;
  type: ExpenseType;
}

export interface RegisterCategoryBody extends CategoryBody {
  user_id: string;
}

export interface InitialExpenseValues {
  name?: string;
  category_id?: string;
  description?: string;
  created_at?: string;
  amount?: number;
  type: ExpenseType;
  installments?: number;
  installmentNumber?: number;
  pluggy_transaction_id?: string;
  pluggy_installments_reference?: string;
  installment_id?: string;
}
