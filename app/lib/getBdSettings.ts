import { DBSettings } from "./interfaces";

export const getBdSettings = (): DBSettings => {
    return {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: "",
        database: "minibanco"
    }
};