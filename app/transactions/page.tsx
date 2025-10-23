'use client'

import { useState } from "react";
import ModalTransactions from "../ui/components/modal-create-transaction";
import TableTransactions from "../ui/components/table-transactions";

export default function Transactions() {
    const [typeTransaction, setTypeTransaction] = useState('Deposito');
    const [showCreateTransaction, setShowCreateTransaction] = useState(false);

    return (
        <div className="">
            <h2 className="text-center text-4xl">Transacciones</h2>

            <div className="flex justify-center items-start gap-3 mt-8">
                <TableTransactions setShowCreateTransaction={setShowCreateTransaction} setTypeTransaction={setTypeTransaction}/>
            </div>
            {
                showCreateTransaction && (
                    <div className="bg-indigo-400/40 flex items-center justify-center w-full fixed inset-0 top-0 left-0">
                        <ModalTransactions setShowCreateTransaction={setShowCreateTransaction} isDeposit={typeTransaction === 'Deposito' ? true : false}/>
                    </div>
                )
            }
        </div>
    );
}