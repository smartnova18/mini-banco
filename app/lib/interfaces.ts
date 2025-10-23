export interface User {
    id?: number;
    idUser?: string;
    name: string;
    last_name: string;
    document_number: string;
}

export interface Account extends User {
    id?: number;
    idAccount?: number;
    type_account: string;
    initial_amount: number;
}

export interface Transaction extends User, Account {
    id: number;
    type_transaction: string;
    amount: number;
}

export interface DBSettings {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
