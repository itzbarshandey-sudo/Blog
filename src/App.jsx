import { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import SiteNav from './components/layout/SiteNav.jsx';
import SiteFooter from './components/layout/SiteFooter.jsx';
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import Post from './pages/Post.jsx';
import Resume from './pages/Resume.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
