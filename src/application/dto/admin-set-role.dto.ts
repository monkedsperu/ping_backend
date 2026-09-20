import { IsIn } from 'class-validator';

export class AdminSetRoleDto {
  @IsIn(['user', 'premium', 'mod', 'admin'])
  role!: 'user' | 'premium' | 'mod' | 'admin';
}
