import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers, updateUser } from "@/app/lib/services/users";


export async function GET(req: NextRequest) {
    try {
        const users = await getAllUsers();
        
        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data: users
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al obtener los usuarios',
            status: 500,
            data: []
        }, {status: 500});
    };
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newIdUser = await createUser(Object.values(data));

        data.id = newIdUser;

        return NextResponse.json({
            ok: true,
            error: null,
            status: 200,
            data,
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Error al crear el usuario',
            status: 500,
            data: []
        }, {status: 500});
    }
}