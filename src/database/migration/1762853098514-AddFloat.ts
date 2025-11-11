import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFloat1762853098514 implements MigrationInterface {
    name = 'AddFloat1762853098514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalPrice" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalPrice" integer`);
    }

}
