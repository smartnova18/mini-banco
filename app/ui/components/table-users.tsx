'use client';

import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { userAtom, usersAtom } from "@/app/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";

import {
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function TableUsers() {
    const setUserAtom = useSetAtom(userAtom);
    const setUsersAtom = useSetAtom(usersAtom);
    const usersAtomValue = useAtomValue(usersAtom);

    const getUsers = async() => {
        const data = await axios.get(`/api/users`);
        
        setUsersAtom(data.data.data);
    };

    const deleteUser = async (idUser: number) => {
        if (!idUser) return;
        const data = await axios.delete(`/api/users/${idUser}`);

        if (data.data.ok) {
            const newUsers = [...usersAtomValue].filter(({id}) => id !== idUser);
            console.log(newUsers);
            setUsersAtom(newUsers);
        }
    };

    const updateUser = (idUser: number) => {
        if (!idUser) return;
        const user = usersAtomValue.find(({id}) => id === idUser);
        setUserAtom(user);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return(
        <div className="relative overflow-y-auto sm:rounded-lg w-[70%]">
            <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Apellido
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Documento
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersAtomValue.length === 0 ? (
                            <tr className="bg-white border-gray-200 hover:bg-gray-200">
                                <td colSpan={5} className="text-center p-3">No hay usuarios creados...</td>
                            </tr>
                        ) : (
                            usersAtomValue.map(({id, name, last_name, document_number}) => (
                                <tr className="bg-white border-gray-200 hover:bg-gray-200" key={id}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        { id }
                                    </th>
                                    <td className="px-6 py-4">
                                        { name }
                                    </td>
                                    <td className="px-6 py-4">
                                        { last_name }
                                    </td>
                                    <td className="px-6 py-4">
                                        { document_number }
                                    </td>
                                    <td className="px-6 py-4 flex justify-around">
                                        <button className="cursor-pointer" onClick={() => updateUser(id)}>
                                            <PencilSquareIcon className="w-6 text-blue-500" />
                                        </button>

                                        <button className="cursor-pointer" onClick={() => deleteUser(id)}>
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