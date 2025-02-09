import { AppProps } from 'next/app';
import RootLayout from '../app/layout';
import DashboardLayout from '../app/dashboard/UserLayout';
import AdminLayout from '../app/AdminLayout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');
  const isAdmin = router.pathname.startsWith('/admin');

  if (isDashboard) {
    return (
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    );
  }

  if (isAdmin) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;