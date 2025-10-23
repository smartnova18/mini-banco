import FormRegister from "../ui/components/form-register";
import TableUsers from "../ui/components/table-users";

export default function Register() {
    return (
        <div>
            <h2 className="text-center text-4xl">Registro de Usuario</h2>

            <div className="flex justify-center items-start gap-3 mt-8">
                <FormRegister/>
                <TableUsers/>
            </div>
        </div>
    );
}