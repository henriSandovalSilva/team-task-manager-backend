import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1743293946079 implements MigrationInterface {
    name = 'InitialMigration1743293946079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "taskId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('Baixa', 'Média', 'Alta')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('Pendente', 'Em progresso', 'Finalizado')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'Média', "status" "public"."task_status_enum" NOT NULL DEFAULT 'Pendente', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "responsibleId" uuid, "teamId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdById" uuid, CONSTRAINT "UQ_cf461f5b40cf1a2b8876011e1e1" UNIQUE ("name"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_teams_team" ("userId" uuid NOT NULL, "teamId" uuid NOT NULL, CONSTRAINT "PK_da60f131c39079373054fd8ed07" PRIMARY KEY ("userId", "teamId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b1d47a221406321be714a8186" ON "user_teams_team" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a80f8ae0d425218dbaa2240df4" ON "user_teams_team" ("teamId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_4ba68e3e65410dfd632913e4373" FOREIGN KEY ("responsibleId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_3a93fbdeba4e1e9e47fec6bada9" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_teams_team" ADD CONSTRAINT "FK_5b1d47a221406321be714a8186d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_teams_team" ADD CONSTRAINT "FK_a80f8ae0d425218dbaa2240df49" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_teams_team" DROP CONSTRAINT "FK_a80f8ae0d425218dbaa2240df49"`);
        await queryRunner.query(`ALTER TABLE "user_teams_team" DROP CONSTRAINT "FK_5b1d47a221406321be714a8186d"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_3a93fbdeba4e1e9e47fec6bada9"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_de59b0c5e20f83310101e5ca835"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_4ba68e3e65410dfd632913e4373"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a80f8ae0d425218dbaa2240df4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b1d47a221406321be714a8186"`);
        await queryRunner.query(`DROP TABLE "user_teams_team"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
