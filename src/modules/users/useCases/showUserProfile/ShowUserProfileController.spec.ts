
import request from 'supertest';
import { Connection } from 'typeorm';

import { createConnection } from '../../../../database';
import { app } from '../../../../app';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';

let connection: Connection;

const user: ICreateUserDTO = {
  name: "Leonardo",
  email: "l@testes.com.br",
  password: "123456"
};

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list user's profile", async () =>{
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "l@testes.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
  })

  it("should not be able to show profile of a non existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "ZZZZ@testes.com.br",
      password: "987654",
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('JWT invalid token!');
  })
})
