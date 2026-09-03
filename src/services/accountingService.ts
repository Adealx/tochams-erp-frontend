import api from "./api";

// ===============================
// TYPES
// ===============================

export interface TrialBalanceAccount {
    account_id: number;
    code: string;
    name: string;
    account_type: string;
    debit: number;
    credit: number;
}

export interface TrialBalance {
    accounts: TrialBalanceAccount[];
    total_debit: number;
    total_credit: number;
    balanced: boolean;
}


// ===============================
// PROFIT & LOSS
// ===============================

export interface ProfitLossAccount {
    account_id: number;
    code: string;
    name: string;
    account_type: string;
    amount: number;
}

export interface ProfitAndLoss {
    revenue: ProfitLossAccount[];
    expenses: ProfitLossAccount[];

    total_revenue: number;
    total_expenses: number;

    net_profit: number;

    is_profitable: boolean;
}


// ===============================
// BALANCE SHEET
// ===============================

export interface BalanceSheetAccount {
    account_id: number;
    code: string;
    name: string;
    account_type: string;
    amount: number;
}

export interface BalanceSheet {
    assets: BalanceSheetAccount[];
    liabilities: BalanceSheetAccount[];
    equity: BalanceSheetAccount[];

    total_assets: number;
    total_liabilities: number;
    total_equity: number;

    net_profit: number;

    total_equity_with_profit: number;

    liabilities_and_equity: number;

    balanced: boolean;
}


// ===============================
// ACCOUNT LEDGER
// ===============================

export interface LedgerEntry {
    date: string;
    reference: string;
    transaction_type: string;
    description: string;

    debit: number;
    credit: number;
    balance: number;
}

export interface AccountLedger {
    account: {
        id: number;
        code: string;
        name: string;
        account_type: string;
    };

    debit_total: number;
    credit_total: number;
    balance: number;

    ledger: LedgerEntry[];
}


// ===============================
// API FUNCTIONS
// ===============================

export const getTrialBalance = async (): Promise<TrialBalance> => {
    const response = await api.get(
        "/accounting/trial-balance/"
    );

    return response.data;
};


export const getProfitAndLoss = async (): Promise<ProfitAndLoss> => {
    const response = await api.get(
        "/accounting/profit-and-loss/"
    );

    return response.data;
};


export const getBalanceSheet = async (): Promise<BalanceSheet> => {
    const response = await api.get(
        "/accounting/balance-sheet/"
    );

    return response.data;
};


export const getAccountLedger = async (
    accountId: number
): Promise<AccountLedger> => {
    const response = await api.get(
        `/accounting/accounts/${accountId}/ledger/`
    );

    return response.data;
};