import * as jsw from "jsonwebtoken";

export interface AuthTokenPayLoad {
    userId: string;
}

export function decodeAuthEncoder(authHeader: String): AuthTokenPayLoad {
    const token = authHeader.replace("Bearer", "");
    if (!token) throw new Error("No token found.");
    // console.log(token);
    // @ts-ignore
    return jsw.verify(token, process.env.APP_SECRET);
}
