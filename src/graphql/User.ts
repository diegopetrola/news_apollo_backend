import { Link } from "@prisma/client";
import { extendType, nonNull, objectType, stringArg } from "nexus";

export const user = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.string("password");
        t.nonNull.list.nonNull.field("links", {
            type: "Link",
            async resolve(parent, args, ctx) {
                const users = (await ctx.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .links())!;

                return users;
            },
        });
        t.nonNull.list.nonNull.field("votes", {
            type: "Link",
            async resolve(root, args, ctx) {
                const votes = (await ctx.prisma.user
                    .findUnique({ where: { id: root.id } })
                    .votes())!;
                return votes;
            },
        });
    },
});

export const searchUser = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("searchUser", {
            type: "User",
            args: { name: stringArg(), email: stringArg() },
            resolve(parent, args, ctx) {
                // if (args.email === undefined && args.email === undefined)
                //     throw new Error("Please specify your search parameters");

                return ctx.prisma.user.findMany({
                    where: {
                        OR: [
                            { name: { contains: args.name! } },
                            { email: args.email! },
                        ],
                    },
                });
            },
        });
    },
});
