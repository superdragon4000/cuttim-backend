import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePricePerUnit1762846499797 implements MigrationInterface {
    name = 'ChangePricePerUnit1762846499797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material" RENAME COLUMN "pricePerUnit" TO "pricePerSquareMm"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material" RENAME COLUMN "pricePerSquareMm" TO "pricePerUnit"`);
    }

}
