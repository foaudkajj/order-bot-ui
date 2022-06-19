import { UserStatus } from "../enums";

export interface LoginResponse {
  UserId: number;
  MerchantId: number;
  UserName: string;
  UserCode: string;
  UserStatus: UserStatus;
  Token: string;
  IsAuthenticated: boolean;
  NavigationItems: NavigationItem[];
}

export class NavigationItem {
  key: string;
  title: string;
  type: string;
  translate: string;
  icon: string;
  url: string;
  children?: NavigationItem[] = [];
}
