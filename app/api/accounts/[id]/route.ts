import { NextRequest, NextResponse } from "next/server";
import { deleteAccount, updateAccount } from "@/app/lib/services/accounts";

export async function PUT(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    try {
        const data = await req.json();
        data.id = (await params).id;

        const accountUpdate = await updateAccount(Object.values(data));

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            account: accountUpdate
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al actualizar la cuenta',
            status: 500,
            data: []
        }, {status: 500});
    };
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    try {
        const { id } = (await params);
        const accountDelete = await deleteAccount(id);

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            account: accountDelete
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al eliminar la cuenta',
            status: 500,
            data: []
        }, {status: 500});
    }
}