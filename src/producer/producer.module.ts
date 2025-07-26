import { Module } from "@nestjs/common";
import { ProducerController } from "./presentation/controllers/producer.controller";
import { ProducerPrismaRepository } from "./infrastructure/prisma/producer.prisma.repository";
import { PrismaService } from "prisma/prisma.service";

@Module({
    imports: [],
    controllers: [ProducerController],
    providers: [ProducerPrismaRepository, PrismaService],
    exports: [ProducerPrismaRepository]
})
export class ProducerModule {}