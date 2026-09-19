import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  /**
   * Crea el usuario si el email no existe, o vincula el googleId si ya
   * existe — en una sola operación atómica de base de datos (upsert por
   * email, que sí es la columna única). Evita la condición de carrera de
   * "buscar por email, luego decidir crear o actualizar" en dos pasos.
   */
  upsertGoogleAccount(input: {
    newId: string;
    email: string;
    googleId: string;
    displayName: string;
  }): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
