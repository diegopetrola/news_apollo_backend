// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//     await prisma.$connect();
//     const allLinks = await prisma.link.findMany();
//     const newLink = await prisma.link.create({
//         data: {
//             description: "Fullstack tutorial for GraphQL",
//             url: "www.howtographql.com",
//         },
//     });
//     console.log(newLink);
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });

console.log(process.env.APP_SECRET);
