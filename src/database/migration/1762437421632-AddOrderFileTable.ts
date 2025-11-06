import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderFileTable1762437421632 implements MigrationInterface {
    name = 'AddOrderFileTable1762437421632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_file" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "fileUrl" character varying NOT NULL, "dxfMetadata" json, "quantity" integer NOT NULL, "calculatedPrice" double precision, "orderId" integer, CONSTRAINT "PK_e7d221312cd948a278ecc889807" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_file" ADD CONSTRAINT "FK_b0096b119c2b9aae8b06cec00e2" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_file" DROP CONSTRAINT "FK_b0096b119c2b9aae8b06cec00e2"`);
        await queryRunner.query(`DROP TABLE "order_file"`);
    }

}
