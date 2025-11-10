import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWidthHeightToOrderFileTable1762796481245 implements MigrationInterface {
    name = 'AddWidthHeightToOrderFileTable1762796481245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_file" ADD "width" double precision`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "height" double precision`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "areaMm2" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "areaMm2"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "width"`);
    }

}
