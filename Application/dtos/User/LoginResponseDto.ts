import { UserDto } from "@app/dtos/User/UserDto";

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}