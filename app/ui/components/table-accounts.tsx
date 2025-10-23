'use client';

import axios from "axios";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { accountAtom, accountsAtom } from "@/app/lib/atoms";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TableAccounts() {
    const setAccountAtom = useSetAtom(accountAtom);
    const setAtomAccounts = useSetAtom(accountsAtom);
    const accountsAtomValue = useAtomValue(accountsAtom);

    const getAccounts = async() => {
        const data = await axios.get(`/api/accounts`);
        
        console.log(data.data);
        setAtomAccounts(data.data.data);
    };

    const deleteAccount = async (idAccount: number) => {
        if (!idAccount) return;
        const data = await axios.delete(`/api/accounts/${idAccount}`);

        if (data.data.ok) {
            const newUsers = [...accountsAtomValue].filter(({id}) => id !== idAccount);
            console.log(newUsers);
            setAtomAccounts(newUsers);
        }
    };

    const updateAccount = (idAccount: number) => {
        if (!idAccount) return;
        
        const account = accountsAtomValue.find(({id}) => id === idAccount);
        setAccountAtom(account);
    }

    useEffect(() => {
        getAccounts();
    }, []);

    return(
        <div className="relative sm:rounded-lg w-[70%]">
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
                            Usuario Asociado
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Monto Inicial
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        accountsAtomValue.length === 0 ? (
                            <tr className="bg-white border-gray-200 hover:bg-gray-200">
                                <td colSpan={5} className="text-center p-3">No hay cuentas creadas...</td>
                            </tr> 
                        ) : (
                            accountsAtomValue.map(({id, name, type_account, initial_amount, last_name, document_number}) => (
                                <tr className="bg-white border-gray-200 hover:bg-gray-200" key={id}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        { id }
                                    </th>
                                    <td className="px-6 py-4">
                                        { type_account }
                                    </td>
                                    <td className="px-6 py-4">
                                        { name } - { last_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${ initial_amount }
                                    </td>
                                    <td className="px-6 py-4 flex justify-around">
                                        <button className="cursor-pointer" onClick={() => updateAccount(id)}>
                                            <PencilSquareIcon className="w-6 text-blue-500" />
                                        </button>

                                        <button className="cursor-pointer" onClick={() => deleteAccount(id)}>
                                            <TrashIcon className="w-6 text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}