import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderCheckoutFields1765600000000 implements MigrationInterface {
  name = 'AddOrderCheckoutFields1765600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_shipping_method_enum" AS ENUM('pickup', 'courier', 'express')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_payment_status_enum" AS ENUM('pending', 'paid', 'failed')`,
    );

    await queryRunner.query(`ALTER TABLE "order" ADD "recipientName" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "recipientPhone" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "shippingCountry" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "shippingCity" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "shippingAddressLine1" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "shippingAddressLine2" text`);
    await queryRunner.query(`ALTER TABLE "order" ADD "shippingPostalCode" text`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "shippingMethod" "public"."order_shipping_method_enum" NOT NULL DEFAULT 'courier'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "shippingCost" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "currency" character varying NOT NULL DEFAULT 'RUB'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "paymentStatus" "public"."order_payment_status_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentStatus"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "currency"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingCost"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingMethod"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingPostalCode"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingAddressLine2"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingAddressLine1"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingCity"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingCountry"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "recipientPhone"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "recipientName"`);

    await queryRunner.query(`DROP TYPE "public"."order_payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_shipping_method_enum"`);
  }
}
