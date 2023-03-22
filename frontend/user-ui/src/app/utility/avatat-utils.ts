import { UserInfoDto } from "../model/user-dto";

export function getInitials(name: string): string {
    const parts = name.split(' ');
    let initials = '';
    for (let i = 0; i < parts.length; i++) {
        initials += parts[i][0];
    }
    return initials.toUpperCase();
}

export function createInitials(userList: Array<UserInfoDto>): void {
    for (const user of userList) {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const initials = getInitials(firstName) + getInitials(lastName);
      user.initials = initials;
    }
  }
