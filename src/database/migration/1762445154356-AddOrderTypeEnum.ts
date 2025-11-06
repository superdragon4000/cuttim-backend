import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTypeEnum1762445154356 implements MigrationInterface {
    name = 'AddOrderTypeEnum1762445154356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_type_enum" AS ENUM('laser', '3d')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "type" "public"."order_type_enum" NOT NULL DEFAULT 'laser'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."order_type_enum"`);
    }

}
