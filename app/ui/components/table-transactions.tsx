'use client';

import { useAtomValue, useSetAtom } from "jotai";
import { transactionsAtom } from "@/app/lib/atoms";
import { useEffect } from "react";
import axios from "axios";

export default function TableTransactions({setShowCreateTransaction, setTypeTransaction}: {setShowCreateTransaction: (value: boolean) => void, setTypeTransaction: (value: string) => void}) {
    const setTransactionsAtom = useSetAtom(transactionsAtom);
    const transactionAtomValue = useAtomValue(transactionsAtom);

    const getTransactions = async() => {
        const {data} = await axios.get('/api/transactions');
        console.log(data);
        if (!data.ok) return;

        setTransactionsAtom(data.data);
    };

    useEffect(() => {
        getTransactions();
    }, []);

    return(
        <div className="relative w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex justify-end sm:flex-row flex-wrap space-y-4 w-full sm:space-y-0 items-center p-2">
                    <div className="flex w-[50%] gap-3 justify-end">
                        <button
                            onClick={() => { 
                                setShowCreateTransaction(true);
                                setTypeTransaction('Deposito');
                            }}
                                className=" bg-green-600 text-white p-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                            >
                            Crear Consignación
                        </button>

                        <button
                            className="bg-blue-600 text-white p-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                            onClick={() => { 
                                setShowCreateTransaction(true);
                                setTypeTransaction('Retiro');
                            }}
                        >
                            Crear Retiro
                        </button>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tipo Cuenta
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Usuario
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Monto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tipo Transacción
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactionAtomValue.length === 0 ? (
                                <tr className="bg-white border-gray-200 hover:bg-gray-200">
                                    <th colSpan={5} className="text-center p-3">No hay transacciones creadas</th>
                                </tr>
                            ) : (
                                transactionAtomValue.map(({id, type_account, name, last_name, amount, type_transaction}) => (
                                    <tr className="bg-white border-gray-200 hover:bg-gray-200" key={id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {type_account}
                                        </td>
                                        <td className="px-6 py-4">
                                            {name} {last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            {type_transaction}
                                        </td>
                                    </tr>
                                ))  
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}