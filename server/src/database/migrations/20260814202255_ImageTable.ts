import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("images", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); 
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("type", 30).notNullable();
    table.integer("scale").nullable();
    table.integer("width").nullable();
    table.integer("height").nullable();
    table.enum("status", ["queued", "processing", "completed", "failed"]).defaultTo("queued");
    table.timestamp("completed_at").nullable();
    
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("images");
}

