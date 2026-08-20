import { useCallback, useEffect, useRef } from 'react';
import { track } from '../lib/analytics';
import { codeShape } from '../lib/packCode';

/*
  The create/join funnel, for every game.

  It existed only in Home.js, so a third of joins failing was measured on one
  game out of twelve while eleven others sent nothing — and those eleven are
  where most of the multiplayer traffic actually is.

  Two things make this less trivial than it looks.

  ONE: the game hooks re-emit `join_game` on every reconnect to restore a
  session. Instrumenting at the socket would count each dropped wifi connection
  as a person trying to join a room, and the funnel would quietly become a
  connectivity chart. So an event only fires when a person pressed a button:
  nothing is recorded unless attemptJoin/attemptCreate opened an attempt.

  TWO: an attempt that gets no answer at all is invisible. Success sends
  `joined`, failure sends `error`, and a request the server never answers sends
  neither — which in a funnel is indistinguishable from someone wandering off,
  except it is our fault. GIVE_UP_MS closes those as failures with a reason of
  their own.
*/

const GIVE_UP_MS = 15000;

export default function useJoinFunnel({ game, roomCode, error, expectedLength = 4 }) {
  const pending = useRef(null);
  const timer = useRef(null);

  const settle = useCallback((event, props) => {
    const attempt = pending.current;
    if (!attempt) return;
    pending.current = null;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    track(event, { ...attempt.base, ...props, ms: Date.now() - attempt.started });
  }, []);

  const begin = useCallback((kind, base) => {
    pending.current = { kind, base: { game, ...base }, started: Date.now() };
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      settle(kind === 'create' ? 'room_create_failed' : 'room_join_failed', { reason: 'no response' });
    }, GIVE_UP_MS);
  }, [game, settle]);

  /* A room code arriving is the only success signal either path has. */
  useEffect(() => {
    if (!roomCode || !pending.current) return;
    settle(pending.current.kind === 'create' ? 'room_created' : 'room_joined', {});
  }, [roomCode, settle]);

  useEffect(() => {
    if (!error || !pending.current) return;
    settle(pending.current.kind === 'create' ? 'room_create_failed' : 'room_join_failed',
      { reason: String(error).slice(0, 80) });
  }, [error, settle]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const attemptCreate = useCallback((props = {}) => {
    begin('create', props);
    track('room_create_attempt', { game, ...props });
  }, [begin, game]);

  const attemptJoin = useCallback((code, props = {}) => {
    /* The shape, never the code itself — see codeShape in lib/packCode.js. */
    const base = {
      codeLength: String(code || '').trim().length,
      codeShape: codeShape(code, expectedLength),
      ...props,
    };
    begin('join', base);
    track('room_join_attempt', { game, ...base });
  }, [begin, game, expectedLength]);

  return { attemptCreate, attemptJoin };
}
