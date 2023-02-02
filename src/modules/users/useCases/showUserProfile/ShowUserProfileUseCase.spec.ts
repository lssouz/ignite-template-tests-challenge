import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;


describe("Show User Profile", () => {
    beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository();
      showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to list user's profile", async () => {
      const user: ICreateUserDTO = {
        name: "Leonardo",
        email: "l@testes.com.br",
        password: "123456"
      };

      const newUser = await createUserUseCase.execute(user);
      const listUser = await showUserProfileUseCase.execute(newUser.id as string);

      expect(listUser).toHaveProperty("id");
      expect(listUser.email).toEqual(newUser.email);
    })

    it("should not be able to show profile of a non existing user", async () => {
      expect(async () => {
        const userId = "TESTE123";
        await showUserProfileUseCase.execute(userId);
      }).rejects.toBeInstanceOf(AppError);
    })
})
