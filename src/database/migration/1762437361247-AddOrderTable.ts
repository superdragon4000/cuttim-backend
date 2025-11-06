import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTable1762437361247 implements MigrationInterface {
    name = 'AddOrderTable1762437361247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'paid', 'fabricated', 'shipped', 'completed', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "order" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "comment" text, "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "trackingNumber" character varying, "trackingAssignedAt" TIMESTAMP, "totalPrice" integer, "paidAt" TIMESTAMP, "fabricatedAt" TIMESTAMP, "shippedAt" TIMESTAMP, "completedAt" TIMESTAMP, "managerComment" text, "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    }

}
