exports.up = (knex) => {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("name").notNull();
    t.string("email").notNull().unique();
    t.string("passsword").notNull();
  });
};

exports.down = (knex) => {
  knex.schema.dropTable("user");
};
