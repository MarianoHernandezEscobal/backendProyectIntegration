export class AuthenticationResponseDto {
    access_token: string;
  
    constructor(access_token: string, userName: string) {
      this.access_token = access_token;
    }
  }