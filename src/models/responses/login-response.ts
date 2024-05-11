import { UserStatus } from "../enums";

export interface LoginResponse {
  userId: number;
  isAdmin: boolean;
  merchantId: number;
  userName: string;
  userStatus: UserStatus;
  token: string;
  isAuthenticated: boolean;
  permissions?: string[];
  navigationItems?: NavigationItem[];
}

export class NavigationItem {
  key: string;
  title: string;
  type: string;
  translate: string;
  icon: string;
  url: string;
  priority: number;
  children?: NavigationItem[] = [];
}
