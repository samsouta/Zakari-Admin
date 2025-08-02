// hooks/useAuth.ts
import Cookies from 'js-cookie';

export function useAuth() {
  const token = Cookies.get('token');
  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    isAuthenticated: !!token && !!user,
    user,
  };
}
