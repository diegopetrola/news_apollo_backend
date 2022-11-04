import { User } from "@prisma/client";
import { extendType, nonNull, objectType, stringArg } from "nexus";

export const vote = objectType({
    name: "Vote",
    definition(t) {
        t.nonNull.field("link", { type: "Link" });
        t.nonNull.field("user", { type: "User" });
    },
});

export const upvote = extendType({
    type: "Mutation",
    definition(t) {
        t.field("vote", {
            type: "Vote",
            args: { linkId: nonNull(stringArg()) },
            async resolve(root, args, ctx) {
                const { linkId } = args;
                const { userId } = ctx;

                const link = await ctx.prisma.link.update({
                    where: { id: linkId },
                    data: {
                        voters: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                });

                const user = await ctx.prisma.user.findUnique({
                    where: { id: userId },
                });
                return { link: link, user: user as User };
            },
        });
    },
});
