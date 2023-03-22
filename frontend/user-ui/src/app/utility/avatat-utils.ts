import { UserInfoDto } from "../model/user-dto";

export const COLORS = [
    '#eb7181',
    '#468547',
    '#ffd558',
    '#3670b2',
];

export function generateColor(): string {
    const randomIndex = Math.floor(Math.random() * Math.floor(COLORS.length));
    return COLORS[randomIndex];
}

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

// export function addInitialsAndColorToUser(user: UserInfoDto): UserInfoDto {
//     const firstName = user.firstName || '';
//     const lastName = user.lastName || '';
//     const initials = getInitials(firstName) + getInitials(lastName);
//     const color = generateColor();
//     return { ...user, initials, color };
// }
