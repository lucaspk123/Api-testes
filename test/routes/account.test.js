const request = require("supertest");

const app = require("../../src/app");

const MAIN_ROUTE = "/account";
let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "user account",
    email: `${Date.now()}@email.com`,
    password: "123456",
  });
  // eslint-disable-next-line rest-spread-spacing
  user = { ...res[0] };
});

test("Deve inserir uma conta com sucesso", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ name: "#acc1", user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("#acc1");
    });
});

test("Deve listar todas as contas", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc list", user_id: user.id })
    .then(() => {
      request(app)
        .get(MAIN_ROUTE)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
});

test("Deve retornar uma conta pelo id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc by id", user_id: user.id }, ["id"])
    .then((acc) => {
      request(app)
        .get(`${MAIN_ROUTE}/${acc[0].id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("Acc by id");
          expect(res.body.user_id).toBe(user.id);
        });
    });
});

test("Devo alterar uma conta", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to update", user_id: user.id }, ["id"])
    .then((acc) => {
      request(app)
        .put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: "Acc updated" })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("Acc updated");
        });
    });
});

test("Devo remover contas", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to remove", user_id: user.id }, ["id"])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});