// auth.service.ts.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService,User } from 'src/app/services/auth.service';
 

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Profile Management', () => {
    const testUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      avatar: '👤',
      bio: 'Test bio',
      joinDate: new Date().toISOString()
    };

    beforeEach(() => {
      // Register a test user
      service.register(testUser.username, testUser.email, testUser.password!);
    });

    it('should update user profile', () => {
      const updatedUser: User = {
        ...testUser,
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio'
      };

      const result = service.updateProfile(updatedUser);
      expect(result).toBeTrue();

      const storedUser = service.getUserById(testUser.id);
      expect(storedUser?.firstName).toBe('Updated');
      expect(storedUser?.lastName).toBe('Name');
      expect(storedUser?.bio).toBe('Updated bio');
    });

    it('should get current user object', () => {
      service.login(testUser.email, testUser.password!);
      const currentUser = service.getCurrentUserObject();
      
      expect(currentUser).toBeTruthy();
      expect(currentUser?.email).toBe(testUser.email);
    });

    it('should get user by ID', () => {
      const user = service.getUserById(testUser.id);
      expect(user).toBeTruthy();
      expect(user?.email).toBe(testUser.email);
    });
  });
});