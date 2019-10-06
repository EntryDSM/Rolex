class Err extends Error {
    message: string;
    status: number;
    code: number;
}

export default Err;