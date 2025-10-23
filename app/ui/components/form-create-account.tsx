'use client';

import * as Yup from "yup";
import { useFormik } from "formik";
import { useAtomValue, useSetAtom } from "jotai";
import { accountAtom, accountsAtom, userAtom, usersAtom } from "@/app/lib/atoms";
import { useEffect } from "react";
import axios from "axios";

interface FormCreateAccount {
    type_account: string;
    idUser: string;
    initial_amount: number;
};

interface TypeAccount {
    idAccount: string;
    nameAccount: string;
};

export default function FormCreateAccount() {
    const setUsersAtom = useSetAtom(usersAtom);
    const setAccountAtom = useSetAtom(accountAtom);
    const usersAtomValue = useAtomValue(usersAtom);
    const setAccountsAtom = useSetAtom(accountsAtom);
    const accountAtomValue = useAtomValue(accountAtom);
    const accountsAtomValue = useAtomValue(accountsAtom);

    const optionsSelectAccounts: TypeAccount[] = [
        {
            idAccount: "0",
            nameAccount: "Ahorro"
        },
        {
            idAccount: "1",
            nameAccount: "Corriente"
        },
        {
            idAccount: "2",
            nameAccount: "CDT"
        },
    ];

    const formik = useFormik<FormCreateAccount>({
        initialValues: {
            type_account: "",
            idUser: "",
            initial_amount: 0
        },
        onSubmit: async (values: FormCreateAccount) => {
            if (!values) return;
            
            const method = accountAtomValue ? 'put' : 'post';
            const URL = accountAtomValue ? `/api/accounts/${accountAtomValue.id}` : '/api/accounts';

            const objData = {
                type_account: values.type_account,
                user_id: values.idUser,
                initial_amount: values.initial_amount
            };            

            const { data } = await axios[method](URL, objData);
            if (accountAtomValue) {
                const newAccounts = accountsAtomValue.map((account) => {
                    if (account.id === accountAtomValue.id) {
                        return data.account;
                    }
                    return account;
                });

                setAccountsAtom(newAccounts);
                setAccountAtom({
                    document_number: "",
                    initial_amount: 0,
                    last_name: "",
                    type_account: "",
                    name: ""
                });
                formik.resetForm();
                return;
            };
            
            setAccountsAtom((oldAccounts) => [
                ...oldAccounts,
                {
                    ...data.account
                }
            ]);

            formik.resetForm();
        },
        validationSchema: Yup.object({
            type_account: Yup.string().required('El tipo de cuenta es requerido'),
            idUser: Yup.string().required('El usuario es requerido'),
            initial_amount: Yup.number().required('El monto inicial es requerido').min(1000, 'El monto inicial debe ser al menos de 1000')
        })
    });

    const getUsers = async() => {
        const data = await axios.get(`/api/users`);
        
        setUsersAtom(data.data.data);
    };

    useEffect(() => {
        if (!accountAtomValue) return;

        formik.resetForm({
            values: {
                idUser: accountAtomValue?.user_id,
                type_account: accountAtomValue?.type_account,
                initial_amount: accountAtomValue?.initial_amount
            }
        });
    }, [accountAtomValue]);

    useEffect(() => {
        getUsers();
    }, []);

    return(
        <form onSubmit={formik.handleSubmit} className="gap-4 flex flex-col w-[30%]">
            <div>
                <label htmlFor="type_account" className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo de Cuenta
                </label>
                <select name="type_account" id="type_account" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.type_account}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="">Selecciona</option>
                    {optionsSelectAccounts.map(({idAccount, nameAccount}) => (
                        <option value={nameAccount} key={idAccount}>{nameAccount}</option>
                    ))}
                </select>
                {
                    formik.touched.type_account && formik.errors.type_account ? (
                        <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.type_account}</span>
                    ) : null
                }
            </div>
            <div>
                <label htmlFor="idUser" className="block text-sm font-semibold text-gray-700 mb-1">
                    Usuario
                </label>
                <select name="idUser" id="idUser" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.idUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="">Selecciona</option>
                    {usersAtomValue.map(({id, name, last_name, document_number}) => (
                        <option value={id} key={document_number}>{name} {last_name}</option>
                    ))}
                </select>
                {
                    formik.touched.idUser && formik.errors.idUser ? (
                        <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.idUser}</span>
                    ) : null
                }
            </div>
            <div>
                <label htmlFor="initial_amount" className="block text-sm font-semibold text-gray-700 mb-1">
                    Monto Inicial
                </label>
                <input
                    id="initial_amount"
                    name="initial_amount"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.initial_amount}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="1000"
                />
                {
                    formik.touched.initial_amount && formik.errors.initial_amount ? (
                        <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.initial_amount}</span>
                    ) : null
                }
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                >
                    Registrar Cuenta
                </button>
            </div>
        </form>
    );
}