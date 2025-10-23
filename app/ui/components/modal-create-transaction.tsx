'use client';

import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Account } from "@/app/lib/interfaces";
import { transactionsAtom } from "@/app/lib/atoms";

export default function ModalTransactions({setShowCreateTransaction, isDeposit = true}: {setShowCreateTransaction: (values: boolean) => void, isDeposit: boolean}) {
    const setTransactionsAtomValue = useSetAtom(transactionsAtom);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [showMessageTransaction, setShowMessageTransaction] = useState(false);
    const formik = useFormik({
        initialValues: {
            amount: "",
            accountId: "",
        },
        onSubmit: async (values) => {
            if (!values) return;

            const objData = {
                amount: values.amount,
                typeTransaction: isDeposit ? 'Deposito' : 'Retiro',
                accountId: values.accountId
            }

            const { data } = await axios.post('/api/transactions', objData);

            if (data.ok) {
                setTransactionsAtomValue((prevTransactions) => [
                    ...prevTransactions,
                    {
                        ...data.transaction
                    }
                ]);

                setShowMessageTransaction(true);
                setTimeout(() => {
                    setShowCreateTransaction(false);
                    setShowMessageTransaction(false);
                }, 1500);
                return;
            };

            alert('Ocurrió un error al crear la transacción');
            setTimeout(() => {
                setShowCreateTransaction(false);
            }, 1500);
        },
        validationSchema: Yup.object({
            accountId: Yup.string().required('La cuenta es requerida'),
            amount: Yup.number().required('El monto es requerido').min(100, 'El monto mínimo es 100'),
        })
    });

    const getAccounts = async() => {
        const data = await axios.get(`/api/accounts`);

        if (!data.data.ok) return;
        setAccounts(data.data.data);
    };

    useEffect(() => {
        getAccounts();
    }, []);

    return(
        <div className="w-[30%]">
            <div className=" bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {
                            isDeposit ? "Consignar" : "Retirar"
                        } Dinero
                    </h3>
                    <button type="button" onClick={() => setShowCreateTransaction(false)} className="end-2.5 text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5">
                    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="accountId" className="block text-sm font-semibold text-gray-700 mb-1">
                                Cuenta
                            </label>
                            <select name="accountId" id="accountId" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            >
                                <option value="">Selecciona</option>
                                {accounts.map(({name, last_name, id, type_account}) => (
                                    <option value={id} key={id}>{type_account} - {name} {last_name}</option>
                                ))}
                            </select>
                            {
                                formik.touched.accountId && formik.errors.accountId ? (
                                    <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.accountId}</span>
                                ) : null
                            }
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-1">
                                Monto a {
                                    isDeposit ? "Consignar" : "Retirar"
                                } 
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="1000"
                            />
                            {
                                formik.touched.amount && formik.errors.amount ? (
                                    <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.amount}</span>
                                ) : null
                            }
                        </div>
                        {
                            showMessageTransaction && (
                                <div>
                                    <span className="text-green-500 text-sm">Transacción aprobada</span>
                                </div>
                            )
                        }
                        <button type="submit" className="w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {
                                isDeposit ? "Consignar" : "Retirar"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div> 
    );
}