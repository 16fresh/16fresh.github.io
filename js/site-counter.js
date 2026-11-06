(() => {
  const loader = document.currentScript;
  const counters = ['site_uv', 'site_pv', 'page_pv'].map(key => document.getElementById('busuanzi_value_' + key)).filter(Boolean);
  if (!counters.length) return;
  const show = text => counters.forEach(el => { el.textContent = text; });
  let site;
  try { site = new URL(loader.dataset.siteUrl); } catch { show('未配置'); return; }
  // Never send preview domains or localhost to the shared public counter.
  if (location.hostname !== site.hostname || location.protocol !== 'https:') {
    show('本地/预览不统计');
    counters.forEach(el => { el.title = '只在正式网站 ' + site.hostname + ' 统计访问，不使用 localhost 的共享计数。'; });
    return;
  }
  // Vercount may display a cached number when its API fails. Prefer unavailable over stale data.
  try { localStorage.removeItem('visitorCountData'); } catch {}
  show('加载中…');
  let finished = false;
  const observer = new MutationObserver(() => {
    if (counters.every(el => /^\d+$/.test(el.textContent.trim()))) {
      finished = true; clearTimeout(timeout); observer.disconnect();
      counters.forEach(el => { el.title = 'Vercount 第三方累计统计，非实时在线人数；不同设备和浏览器可能分别计数。'; });
    }
  });
  counters.forEach(el => observer.observe(el, { childList: true, subtree: true, characterData: true }));
  const fail = () => { if (finished) return; finished = true; observer.disconnect(); show('暂不可用'); };
  const timeout = setTimeout(fail, 10000);
  const script = document.createElement('script');
  script.src = loader.dataset.counterSrc; script.async = true;
  script.onerror = () => { clearTimeout(timeout); fail(); };
  document.body.appendChild(script);
})();
