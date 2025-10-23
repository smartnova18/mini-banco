import { NextRequest, NextResponse } from "next/server";
import { getAccount, updateInitialAmount } from "@/app/lib/services/accounts";
import { createTransaction, getAllTransactions } from "@/app/lib/services/transactions";

export async function GET(req: NextRequest) {
    try {
        const transactions = await getAllTransactions();
        
        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data: transactions
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al obtener las transacciones',
            status: 500,
            data: []
        }, {status: 500});
    };
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const account: any = await getAccount(data.accountId);

        if (!account) {
            return NextResponse.json({
                ok: false,
                error: 'No existe la cuenta especificada',
                status: 404,
                data: []
            }, {status: 404});    
        }

        
        const newAmount = data.typeTransaction === 'Deposito' ? parseInt(account[0].initial_amount) + parseInt(data.amount) : parseInt(account[0].initial_amount) - parseInt(data.amount);
        await updateInitialAmount([newAmount, data.accountId]);

        const transaction = await createTransaction(Object.values(data));

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            transaction
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al crear la transacción',
            status: 500,
            data: []
        }, {status: 500});
    }
}