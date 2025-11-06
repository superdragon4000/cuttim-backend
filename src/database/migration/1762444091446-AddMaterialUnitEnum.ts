import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialUnitEnum1762444091446 implements MigrationInterface {
    name = 'AddMaterialUnitEnum1762444091446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."material_unit_enum" AS ENUM('mm', 'cm', 'inch')`);
        await queryRunner.query(`ALTER TABLE "material" ADD "unit" "public"."material_unit_enum" NOT NULL DEFAULT 'mm'`);
        await queryRunner.query(`ALTER TABLE "material" DROP COLUMN "thickness"`);
        await queryRunner.query(`ALTER TABLE "material" ADD "thickness" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material" DROP COLUMN "thickness"`);
        await queryRunner.query(`ALTER TABLE "material" ADD "thickness" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "material" DROP COLUMN "unit"`);
        await queryRunner.query(`DROP TYPE "public"."material_unit_enum"`);
    }

}
