'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAtomValue, useSetAtom } from 'jotai';
import { User } from '@/app/lib/interfaces';
import { userAtom, usersAtom } from '@/app/lib/atoms';
import axios from 'axios';
import { useEffect } from 'react';

export default function FormRegister() {
    const setUserAtom = useSetAtom(userAtom);
    const setUsersAtom = useSetAtom(usersAtom);
    const userAtomValue = useAtomValue(userAtom);
    const usersAtomValue = useAtomValue(usersAtom);

    const formik = useFormik<User>({
        initialValues: {
            name: "",
            last_name: "",
            document_number: ""
        },
        onSubmit: async (values: User) => {
            if (!values) return;
            const method = userAtomValue ? 'put' : 'post';
            const URL = userAtomValue ? `/api/users/${userAtomValue.id}` : '/api/users';

            const { data } = await axios[method](URL, values);

            if (userAtomValue) {
                const newUsers = usersAtomValue.map((user) => {
                    if (user.id === userAtomValue.id) {
                        return data.data;
                    }
                    return user;
                });
                console.log('---', newUsers);
                setUsersAtom(newUsers);
                setUserAtom({
                    name: "",
                    last_name: "",
                    document_number: ""
                });
                formik.resetForm();
                return;
            };

            setUsersAtom((oldUsers) => [
                ...oldUsers,
                {
                    ...data.data
                }
            ]);

            formik.resetForm();
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es obligatorio'),
            last_name: Yup.string().required('El apellido es obligatorio'),
            document_number: Yup.number().required('El documento es obligatorio')
        })
    });

    useEffect(() => {
        if (!userAtomValue) return;

        formik.resetForm({
            values: {
                name: userAtomValue?.name,
                last_name: userAtomValue?.last_name,
                document_number: userAtomValue?.document_number
            }
        });
    }, [userAtomValue]);

    return(
        <div className="w-[30%] bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre del usuario
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Ingresa el nombre"
                    />
                    {
                        formik.touched.name && formik.errors.name ? (
                            <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.name}</span>
                        ) : null
                    }
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Apellido del usuario
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.last_name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Ingresa el apellido"
                    />
                    {
                        formik.touched.last_name && formik.errors.last_name ? (
                            <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.last_name}</span>
                        ) : null
                    }
                </div>

                <div>
                    <label htmlFor="document_number" className="block text-sm font-semibold text-gray-700 mb-1">
                        Documento del usuario
                    </label>
                    <input
                        id="document_number"
                        name="document_number"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.document_number}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Número de documento"
                    />
                    {
                        formik.touched.document_number && formik.errors.document_number ? (
                            <span className="block mt-1 text-xs text-red-600 font-semibold rounded px-2 py-1">{formik.errors.document_number}</span>
                        ) : null
                    }
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                        {
                            userAtomValue ? 'Editar Usuario' : 'Registrar Usuario'
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}