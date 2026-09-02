import { Outlet } from 'react-router-dom';
import SiteNav from './SiteNav.jsx';
import SiteFooter from './SiteFooter.jsx';
import PageCurtain from './PageCurtain.jsx';

export default function Layout() {
  return (
    <>
      <PageCurtain />
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
