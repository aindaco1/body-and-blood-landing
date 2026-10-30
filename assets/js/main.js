(() => {
  'use strict';
  const pool = document.querySelector('#pool');
  const toggle = document.querySelector('.motion-toggle');
  if (!pool || !toggle) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const still = pool.getAttribute('src');
  let paused = false;
  let ready = false;
  const update = () => {
    const restricted = reduced.matches || Boolean(connection?.saveData);
    const moving = ready && !restricted && !paused && !document.hidden;
    const next = moving ? pool.dataset.motionSrc : still;
    if (pool.getAttribute('src') !== next) pool.setAttribute('src', next);
    toggle.hidden = restricted || !ready;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = paused ? '<span aria-hidden="true">▷</span> Play motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
  };
  pool.addEventListener('error', () => {
    if (pool.getAttribute('src') !== still) { ready = false; update(); }
  });
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  reduced.addEventListener('change', update);
  connection?.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => { ready = false; update(); });
  window.addEventListener('pageshow', () => { ready = true; update(); });
  if (document.readyState === 'complete') { ready = true; update(); }
  else window.addEventListener('load', () => { ready = true; update(); }, { once: true });
})();
