import { arg, extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
// import { NexusGenObjects } from "../../nexus-typegen";

export const auth = objectType({
    name: "AuthPayLoad",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});

export const signup = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "AuthPayLoad",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(parent, args, ctx) {
                const user = await ctx.prisma.user.findUnique({
                    where: { email: args.email },
                });
                if (!user) throw new Error("Invalid Credentials");

                const pass = await bcrypt.hash(args.password, 10);
                const valid = await bcrypt.compare(
                    args.password,
                    user.password
                );
                if (!valid) throw new Error("Invalid Credentials");

                const token = jwt.sign(
                    { userId: user.id },
                    process.env.APP_SECRET!
                );
                return { token, user };
            },
        });

        t.nonNull.field("signup", {
            type: "AuthPayLoad",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                name: nonNull(stringArg()),
            },
            async resolve(parent, args, ctx) {
                const { email, name } = args;
                const password = await bcrypt.hash(args.password, 10);
                const user = await ctx.prisma.user.create({
                    data: { email, name, password },
                });
                const token = jwt.sign(
                    { userId: user.id },
                    //@ts-ignore
                    process.env.APP_SECRET
                );
                return { user, token };
            },
        });
    },
});
