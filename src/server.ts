import app from "./app";
import { PORT } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("An error occurred:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();