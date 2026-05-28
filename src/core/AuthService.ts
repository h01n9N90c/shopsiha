import { User, UserRole, UserProfileFields } from '../types';

export interface IAuthService {
  login(email: string, pass: string): Promise<User>;
  register(email: string, name: string, role?: UserRole): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
  updateProfile(userId: string, profileFields: UserProfileFields): User;
  getAllUsers(): User[];
  updateUserRole(userId: string, role: UserRole): User;
  deleteUser(userId: string): void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin SI HA',
    role: 'admin',
    email: 'admin@s.com',
    profile: {
      phone: '0901234567',
      address: 'CN1: Gò Vấp, SG',
      gender: 'Nữ',
      height: '165',
      weight: '48',
      dressSize: 'S',
      shoeSize: '37',
      preferredStyle: 'Parisian Chic',
      receiveNotifications: true,
      receiveEmails: true,
      currency: 'VND',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'user-1',
    name: 'Nguyễn Vy Anh',
    role: 'user',
    email: 'user@s.com',
    profile: {
      phone: '0988777666',
      address: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      gender: 'Nữ',
      height: '162',
      weight: '47',
      dressSize: 'M',
      shoeSize: '36',
      preferredStyle: 'Cinderella Princess',
      receiveNotifications: true,
      receiveEmails: false,
      currency: 'VND',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  }
];

export class AuthService implements IAuthService {
  private usersKey = 'siha_users';
  private currentUserKey = 'siha_current_user';

  constructor() {
    // Seed default users if not present
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify(DEFAULT_USERS));
    }
  }

  private getUsers(): User[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  async login(email: string, pass: string): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    
    // Check if user exists
    let user = users.find(u => u.email.toLowerCase() === trimmedEmail);
    
    if (!user) {
      // Dynamic fallback creation for demo consistency
      const role: UserRole = trimmedEmail.includes('admin') ? 'admin' : 'user';
      const name = trimmedEmail.includes('admin') ? 'Admin SI HA' : 'Khách Hàng SIHA';
      user = {
        id: `user-${Date.now()}`,
        name,
        role,
        email: trimmedEmail,
        profile: {
          phone: '',
          address: '',
          gender: 'Nữ',
          height: '160',
          weight: '50',
          dressSize: 'M',
          shoeSize: '37',
          preferredStyle: 'Parisian Chic',
          receiveNotifications: true,
          receiveEmails: true,
          currency: 'VND',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(trimmedEmail)}`
        }
      };
      users.push(user);
      this.saveUsers(users);
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return user;
  }

  async register(email: string, name: string, role: UserRole = 'user'): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error('Email đã được đăng ký trên hệ thống!');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      role,
      email: trimmedEmail,
      profile: {
        phone: '',
        address: '',
        gender: 'Nữ',
        height: '160',
        weight: '50',
        dressSize: 'M',
        shoeSize: '37',
        preferredStyle: 'Cinderella Princess',
        receiveNotifications: true,
        receiveEmails: false,
        currency: 'VND',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(trimmedEmail)}`
      }
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
    return newUser;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  updateProfile(userId: string, profileFields: UserProfileFields): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { 
      ...users[index], 
      profile: { 
        ...(users[index].profile || {}), 
        ...profileFields 
      } 
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    const currentSaved = this.getCurrentUser();
    if (currentSaved && currentSaved.id === userId) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  updateUserRole(userId: string, role: UserRole): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const updatedUser = { ...users[index], role };
    users[index] = updatedUser;
    this.saveUsers(users);

    const currentSaved = this.getCurrentUser();
    if (currentSaved && currentSaved.id === userId) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  deleteUser(userId: string): void {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    this.saveUsers(users);

    const currentSaved = this.getCurrentUser();
    if (currentSaved && currentSaved.id === userId) {
      localStorage.removeItem(this.currentUserKey);
    }
  }
}
