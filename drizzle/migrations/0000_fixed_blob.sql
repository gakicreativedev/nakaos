CREATE TABLE "brand_colors" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"nome" text NOT NULL,
	"hex" text NOT NULL,
	"rgb" text NOT NULL,
	"cmyk" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_fonts" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"download_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_historico" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"data" text NOT NULL,
	"usuario" text NOT NULL,
	"descricao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_hubs" (
	"client_id" text PRIMARY KEY NOT NULL,
	"nicho" text DEFAULT '' NOT NULL,
	"publico_alvo" text DEFAULT '' NOT NULL,
	"tom_de_voz" text DEFAULT '' NOT NULL,
	"slogan" text DEFAULT '' NOT NULL,
	"concorrentes" text DEFAULT '' NOT NULL,
	"restricoes_visuais" text DEFAULT '' NOT NULL,
	"figma_url" text,
	"ultima_atualizacao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_logos" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"categoria" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"link_externo" text
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"logo" text,
	"cnpj" text NOT NULL,
	"responsavel" text NOT NULL,
	"telefone" text NOT NULL,
	"email" text NOT NULL,
	"endereco" text NOT NULL,
	"redes_sociais" jsonb,
	"status" text NOT NULL,
	"servicos_contratados" jsonb NOT NULL,
	"valor_mensal" double precision NOT NULL,
	"data_inicio" text NOT NULL,
	"data_renovacao" text NOT NULL,
	"observacoes" text DEFAULT '' NOT NULL,
	"cover_image" text,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanban_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"client_id" text NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movimentacoes" (
	"id" text PRIMARY KEY NOT NULL,
	"valor" double precision NOT NULL,
	"categoria" text NOT NULL,
	"data" text NOT NULL,
	"descricao" text NOT NULL,
	"client_id" text,
	"status" text NOT NULL,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"nome" text NOT NULL,
	"url" text NOT NULL,
	"tipo" text NOT NULL,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_colors" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"nome" text NOT NULL,
	"hex" text NOT NULL,
	"rgb" text NOT NULL,
	"cmyk" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_fonts" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"download_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_historico" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"data" text NOT NULL,
	"usuario" text NOT NULL,
	"descricao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_identidade" (
	"projeto_id" text PRIMARY KEY NOT NULL,
	"nicho" text DEFAULT '' NOT NULL,
	"publico_alvo" text DEFAULT '' NOT NULL,
	"tom_de_voz" text DEFAULT '' NOT NULL,
	"slogan" text DEFAULT '' NOT NULL,
	"concorrentes" text DEFAULT '' NOT NULL,
	"restricoes_visuais" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_kanban_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"projeto_id" text NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_logos" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"categoria" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"link_externo" text
);
--> statement-breakpoint
CREATE TABLE "projeto_membros" (
	"id" text PRIMARY KEY NOT NULL,
	"projeto_id" text NOT NULL,
	"usuario_id" text NOT NULL,
	"papel" text NOT NULL,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projeto_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"responsavel" text NOT NULL,
	"prazo" text NOT NULL,
	"prioridade" text NOT NULL,
	"tags" jsonb NOT NULL,
	"projeto_id" text NOT NULL,
	"coluna_id" text NOT NULL,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projetos" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"logo" text,
	"status" text NOT NULL,
	"figma_url" text,
	"cover_image" text,
	"criado_em" text NOT NULL,
	"atualizado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_anexos" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"usuario" text NOT NULL,
	"texto" text NOT NULL,
	"data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_etapas" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"titulo" text NOT NULL,
	"responsavel" text NOT NULL,
	"prazo" text NOT NULL,
	"concluida" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"responsavel" text NOT NULL,
	"prazo" text NOT NULL,
	"prioridade" text NOT NULL,
	"tags" jsonb NOT NULL,
	"client_id" text,
	"coluna_id" text NOT NULL,
	"recorrente" boolean DEFAULT false NOT NULL,
	"frequencia" text,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"auth_user_id" text,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"cargo" text NOT NULL,
	"role" text NOT NULL,
	"avatar" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" text NOT NULL,
	"ultimo_acesso" text NOT NULL,
	"alertas" jsonb NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "brand_colors" ADD CONSTRAINT "brand_colors_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_fonts" ADD CONSTRAINT "brand_fonts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_historico" ADD CONSTRAINT "brand_historico_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_hubs" ADD CONSTRAINT "brand_hubs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_logos" ADD CONSTRAINT "brand_logos_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban_columns" ADD CONSTRAINT "kanban_columns_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_assets" ADD CONSTRAINT "projeto_assets_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_colors" ADD CONSTRAINT "projeto_colors_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_fonts" ADD CONSTRAINT "projeto_fonts_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_historico" ADD CONSTRAINT "projeto_historico_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_identidade" ADD CONSTRAINT "projeto_identidade_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_kanban_columns" ADD CONSTRAINT "projeto_kanban_columns_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_logos" ADD CONSTRAINT "projeto_logos_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_membros" ADD CONSTRAINT "projeto_membros_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_membros" ADD CONSTRAINT "projeto_membros_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_tasks" ADD CONSTRAINT "projeto_tasks_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_tasks" ADD CONSTRAINT "projeto_tasks_coluna_id_projeto_kanban_columns_id_fk" FOREIGN KEY ("coluna_id") REFERENCES "public"."projeto_kanban_columns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_anexos" ADD CONSTRAINT "task_anexos_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_etapas" ADD CONSTRAINT "task_etapas_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_coluna_id_kanban_columns_id_fk" FOREIGN KEY ("coluna_id") REFERENCES "public"."kanban_columns"("id") ON DELETE cascade ON UPDATE no action;