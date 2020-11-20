export interface Client {
    _id: string
    _ts: number
    name: string
    balance: number
}

export interface ClientPage {
    data: Client[]
    after?: string
    before?: string
}

export interface Company {
    _id: string
    _ts: number
    name: string
}

export interface CompanyPage {
    data: Company[]
    after?: string
    before?: string
}

export interface Transaction {
    debit: number
    _id: string
    credit: number
    company: Company
    date: string
    narration: string
    client: Client
    _ts: number
}

export interface ClientInput {
    _id?: string
    name: string
    balance: number
}