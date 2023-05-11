
import CountRow from "../database/interfaces"
interface CountResponse {
    err: string;
    data: CountRow[] | null;
}

const notFoundResponse: CountResponse = {err: "Not Found", data: null};
const badStrings: CountResponse = {err: "Namespace and Counter must both be nonempty and less than 64 characters long.", data: null};

export default CountResponse;