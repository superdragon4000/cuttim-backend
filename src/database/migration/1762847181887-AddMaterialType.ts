import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialType1762847181887 implements MigrationInterface {
    name = 'AddMaterialType1762847181887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material" DROP COLUMN "type"`);
    }

}
