import { deleteUser, updateUser } from "@/app/lib/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    try {
        const data = await req.json();
        data.id = (await params).id;

        await updateUser(Object.values(data));

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data: data
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al actualizar el usuario',
            status: 500,
            data: []
        }, {status: 500});
    };
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    try {
        const { id } = (await params);
        const userDelete = await deleteUser(id);

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data: userDelete
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al eliminar el usuario',
            status: 500,
            data: []
        }, {status: 500});
    }
}