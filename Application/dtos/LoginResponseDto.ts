import { UserDto } from "@app/dtos/UserDto";

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}
