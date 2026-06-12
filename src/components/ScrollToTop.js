import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
  Reset scroll to the top on every route change. React Router does NOT do this
  by default, so without it a new page mounts at the previous page's scroll
  offset. Keyed on pathname only, so in-page hash links (#play, #top) and
  query-string changes (e.g. /?join=CODE, which scrolls to its own anchor)
  are left alone.
*/
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
