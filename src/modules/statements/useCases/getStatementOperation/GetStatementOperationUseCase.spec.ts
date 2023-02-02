import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUserCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

const user: ICreateUserDTO = {
  name: "Leonardo",
  email: "teste@matsuda.com.br",
  password: "123456"
};

interface IRequest {
  user_id: string,
  statement_id: string
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUserCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to get statement", async () => {
    const newUser = await createUserUseCase.execute(user);

    const deposit: ICreateStatementDTO = {
      user_id: newUser.id as string,
      description: "Deposito em conta",
      amount: 200.00,
      type: OperationType.DEPOSIT
    }

    const resultOperation = await createStatementUseCase.execute(deposit);

    expect(resultOperation).toHaveProperty("id");

    const request: IRequest = {
      user_id: resultOperation.user_id,
      statement_id: resultOperation.id as string
    };

    const resultStatement = await getStatementOperationUserCase.execute(request);

    expect(resultOperation).toHaveProperty("id");
    expect(resultOperation.amount).toEqual(deposit.amount);
  })

  it("should be not able to get statement from non-existing user", async () => {
    const request: IRequest = {
      user_id: "ZZZ123",
      statement_id: "XXX987"
    };

    expect(async () => {
      await getStatementOperationUserCase.execute(request);
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("should be not able to get non-existing statement", async () => {
    const newUser = await createUserUseCase.execute(user);

    const request: IRequest = {
      user_id: newUser.id as string,
      statement_id: "XXX987"
    };

    expect(async () => {
      await getStatementOperationUserCase.execute(request);
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
});
