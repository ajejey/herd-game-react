import { useEffect, useState } from 'react';
import { cleanPackCode } from './packCode';

/*
  Read ?pack=CODE from the URL and look it up.

  Shared rather than copy-pasted into each game's home page: this is now on five
  pages, and the important behaviour — showing the host what will be played
  BEFORE the room exists — is exactly the kind of thing that quietly rots in one
  of five copies. A mistyped code has to be caught here, not in front of a class.

  Returns { packCode, packInfo }:
    packInfo === null            -> no code in the URL, or still loading
    packInfo.error === true      -> the code is wrong or expired
    otherwise                    -> { packCode, title, count, questions }
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export default function usePackFromUrl(search) {
  const [packCode, setPackCode] = useState('');
  const [packInfo, setPackInfo] = useState(null);

  const query = search !== undefined ? search : (typeof window !== 'undefined' ? window.location.search : '');

  useEffect(() => {
    let live = true;
    // Shared with the pack page and the backend. Hyphens are part of the
    // format now, so a local copy that strips them breaks every named pack.
    const code = cleanPackCode(new URLSearchParams(query || '').get('pack'));
    if (!code) { setPackCode(''); setPackInfo(null); return undefined; }

    setPackCode(code);
    fetch(`${BACKEND_URL}/api/packs/${code}`)
      .then((r) => r.json())
      .then((d) => { if (live) setPackInfo(d && d.ok ? d : { error: true }); })
      .catch(() => { if (live) setPackInfo({ error: true }); });

    return () => { live = false; };
  }, [query]);

  return { packCode, packInfo };
}
