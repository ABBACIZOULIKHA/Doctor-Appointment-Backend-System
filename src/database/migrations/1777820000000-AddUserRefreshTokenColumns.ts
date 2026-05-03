import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRefreshTokenColumns1777820000000 implements MigrationInterface {
  name = 'AddUserRefreshTokenColumns1777820000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "refresh_token_hash" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "refresh_token_expires_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "refresh_token_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "refresh_token_hash"`,
    );
  }
}
