import TableAccounts from "../ui/components/table-accounts";
import FormCreateAccount from "../ui/components/form-create-account";

export interface Account {
    idUser: string;
    nameUser: string;
    idAccount: number;
    typeAccount: string;
    initialAmount: number;
};

export default function Accounts() {
    return (
        <div>
            <h1 className="text-center text-4xl">Registro de Cuentas</h1>
            <div className="flex justify-center items-start gap-3 mt-8">
                <FormCreateAccount/>
                <TableAccounts/>
            </div>
        </div>
    );
}