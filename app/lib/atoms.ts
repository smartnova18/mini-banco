import { atom } from 'jotai';
import { Account, Transaction, User } from './interfaces';

export const userAtom = atom<User>();
export const usersAtom = atom<User[]>([]);
export const accountAtom = atom<Account>();
export const accountsAtom = atom<Account[]>([]);
export const transactionsAtom = atom<Transaction[]>([]);