import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1760294720001 implements MigrationInterface {
    name = 'AddUserTable1760294720001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('client', 'manager')`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'client', "name" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
