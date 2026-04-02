import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/add-link/:path*',
    '/categories/:path*',
    '/favorites/:path*',
    '/settings/:path*',
  ],
};