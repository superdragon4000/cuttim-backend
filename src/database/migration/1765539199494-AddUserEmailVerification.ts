import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEmailVerification1765539199494 implements MigrationInterface {
    name = 'AddUserEmailVerification1765539199494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationTokenIssuedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastVerificationEmailSentAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastVerificationEmailSentAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationTokenIssuedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
    }

}
