import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialTable1762437483769 implements MigrationInterface {
    name = 'AddMaterialTable1762437483769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "material" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "thickness" character varying NOT NULL, "pricePerUnit" double precision NOT NULL, "description" text, CONSTRAINT "PK_0343d0d577f3effc2054cbaca7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "materialId" integer`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD CONSTRAINT "FK_45961e310a801acbfc4c051e352" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_file" DROP CONSTRAINT "FK_45961e310a801acbfc4c051e352"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "materialId"`);
        await queryRunner.query(`DROP TABLE "material"`);
    }

}
