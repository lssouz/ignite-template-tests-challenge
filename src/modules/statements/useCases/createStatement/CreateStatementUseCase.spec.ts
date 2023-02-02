import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

const user: ICreateUserDTO = {
  name: "Leonardo",
  email: "teste@matsuda.com.br",
  password: "123456"
};

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to make deposit", async () => {
    const newUser = await createUserUseCase.execute(user);

    const deposit: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Deposito em conta",
      amount: 200.00,
      type: OperationType.DEPOSIT
    }

    const result = await createStatementUseCase.execute(deposit);

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual(OperationType.DEPOSIT);
  })

  it("should be able to make withdraw", async () => {
    const newUser = await createUserUseCase.execute(user);

    const deposit: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Deposito em conta",
      amount: 200.00,
      type: OperationType.DEPOSIT
    }

    await createStatementUseCase.execute(deposit);

    const withdraw: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Saque em conta",
      amount: 200.00,
      type: OperationType.WITHDRAW
    }

    let result = await createStatementUseCase.execute(withdraw);

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual(OperationType.WITHDRAW);
  });

  it("should not be able to deposit/withdraw with non-existing user", async () => {
    const deposit: ICreateStatementDTO = {
      user_id: "ZZZ123",
      description: "Deposito em conta",
      amount: 200.00,
      type: OperationType.DEPOSIT
    }

    expect(async ()=>{
      await createStatementUseCase.execute(deposit);
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to withdraw without money", async () => {
    const newUser = await createUserUseCase.execute(user);

    const withdraw: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Saque em conta",
      amount: 400.00,
      type: OperationType.WITHDRAW
    }

    expect(async ()=>{
      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(AppError);
  })
});
