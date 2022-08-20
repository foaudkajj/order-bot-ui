import { UserStatus } from "../enums";

export interface LoginResponse {
  userId: number;
  merchantId: number;
  userName: string;
  userCode: string;
  userStatus: UserStatus;
  token: string;
  isAuthenticated: boolean;
  navigationItems: NavigationItem[];
}

export class NavigationItem {
  key: string;
  title: string;
  type: string;
  translate: string;
  icon: string;
  url: string;
  priority:number;
  children?: NavigationItem[] = [];
}
