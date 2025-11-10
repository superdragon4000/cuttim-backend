import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileName1762798504220 implements MigrationInterface {
    name = 'AddFileName1762798504220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "originalName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "storageName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "storageName"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "fileName" character varying NOT NULL`);
    }

}
