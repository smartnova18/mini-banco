import { createAccount, getAllAccounts } from "@/app/lib/services/accounts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const accounts = await getAllAccounts();
        
        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data: accounts
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al obtener las cuentas',
            status: 500,
            data: []
        }, {status: 500});
    };
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newAccount = await createAccount(Object.values(data));

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            account: newAccount,
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al crear la cuenta',
            status: 500,
            data: []
        }, {status: 500});
    }
}