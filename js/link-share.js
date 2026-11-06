(() => {
  document.querySelectorAll('.fresh-share').forEach(box => {
    if (box.dataset.ready) return;
    box.dataset.ready = 'true';
    const status = box.querySelector('.fresh-share-status');
    const manual = box.querySelector('.fresh-share-manual');
    const input = manual.querySelector('input');
    const share = box.querySelector('.fresh-system-share');
    const url = box.dataset.url;
    const data = { title: box.dataset.title, url };
    const selectLink = () => {
      manual.hidden = false;
      input.focus(); input.select(); input.setSelectionRange(0, input.value.length);
      status.textContent = '链接已选中，请按 Ctrl+C，或长按复制后发送给好友。';
    };
    box.querySelector('.fresh-copy-link').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) return selectLink();
        await navigator.clipboard.writeText(url);
        status.textContent = '已复制文章链接，可以粘贴到微信或 QQ 发送。';
      } catch { selectLink(); }
    });
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) share.hidden = false;
    share.addEventListener('click', async () => {
      try {
        await navigator.share(data);
        status.textContent = '已交给系统分享面板处理。';
      } catch (error) {
        if (error.name === 'AbortError') status.textContent = '已取消分享。';
        else selectLink();
      }
    });
  });
})();
