
import request from 'supertest';
import { Connection } from 'typeorm';

import { createConnection } from '../../../../database';
import { app } from '../../../../app';
import { ICreateUserDTO } from './ICreateUserDTO';

let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create user", async () => {
    const user: ICreateUserDTO = {
      name: "Leonardo",
      password: "123456",
      email: "teste@matsuda.com.br"
    }

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(201);
  })

  it ("should not be able to create new users when email is already token", async () => {
    const user: ICreateUserDTO = {
      name: "Leonardo",
      password: "123456",
      email: "teste@testes.com"
    };

    await request(app).post("/api/v1/users").send(user);
    const createUser = await request(app).post("/api/v1/users").send(user);

    expect(createUser.status).toBe(400);
  });
})
