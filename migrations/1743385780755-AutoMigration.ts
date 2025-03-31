import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1743385780755 implements MigrationInterface {
    name = 'AutoMigration1743385780755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9fc19c95c33ef4d97d09b72ee9" ON "comment" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de59b0c5e20f83310101e5ca83" ON "task" ("teamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2cc4c76495121fb01694252386" ON "team" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cc4c76495121fb01694252386"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de59b0c5e20f83310101e5ca83"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9fc19c95c33ef4d97d09b72ee9"`);
    }

}
