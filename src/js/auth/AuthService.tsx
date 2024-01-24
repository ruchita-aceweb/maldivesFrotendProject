export const AuthUtils = {
    getUser: (): string | null => {
      const user = localStorage.getItem('email');
      if (user === 'undefined' || !user) {
        return null;
      } else {
        return user;
      }
    },
  
    getToken: (): string | null => {
      return localStorage.getItem('token');
    },
  
    setUserSession: (user: string, token: string): void => {
      localStorage.setItem('email', user);
      localStorage.setItem('token', token);
    },
  
    resetUserSession: (): void => {
      localStorage.clear();
    
    },
  };
  