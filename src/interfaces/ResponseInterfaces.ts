
import CountRow from "../database/interfaces"
export interface CountResponse {
    err: string;
    data: CountRow[] | null;
}

export const notFoundResponse: CountResponse = {err: "Not Found", data: null};
export const badStrings: CountResponse = {err: "Namespace and Counter must both be nonempty and less than 64 characters long.", data: null};
