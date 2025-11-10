import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileTable1762798073749 implements MigrationInterface {
    name = 'AddFileTable1762798073749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "fileUrl" character varying NOT NULL, "dxfMetadata" json, "width" double precision, "height" double precision, "areaMm2" double precision, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "dxfMetadata"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "areaMm2"`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "fileId" integer`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD CONSTRAINT "FK_241733aec51e34a1d76fdae35f0" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_file" DROP CONSTRAINT "FK_241733aec51e34a1d76fdae35f0"`);
        await queryRunner.query(`ALTER TABLE "order_file" DROP COLUMN "fileId"`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "areaMm2" double precision`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "height" double precision`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "width" double precision`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "dxfMetadata" json`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "fileUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD "fileName" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
