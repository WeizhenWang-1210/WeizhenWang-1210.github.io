(() => {
  const container = document.querySelector('[data-visitor-map]');
  if (!container || container.dataset.trackingEnabled !== 'true') return;

  const status = container.querySelector('[data-map-status]');
  const slot = container.querySelector('[data-map-slot]');
  let timeout;
  let observer;

  const ready = () => {
    clearTimeout(timeout);
    status.hidden = true;
    observer.disconnect();
  };
  const unavailable = () => {
    clearTimeout(timeout);
    status.hidden = false;
    status.textContent = 'Visitor map is currently unavailable.';
  };
  const checkMap = () => {
    const image = slot.querySelector('img');
    if (image) {
      if (image.complete && image.naturalWidth > 0) ready();
      else {
        image.addEventListener('load', ready, { once: true });
        image.addEventListener('error', unavailable, { once: true });
      }
    }
    const frame = slot.querySelector('iframe');
    if (frame) frame.addEventListener('load', ready, { once: true });
  };

  observer = new MutationObserver(checkMap);
  observer.observe(slot, { childList: true, subtree: true });
  const script = document.createElement('script');
  script.id = 'clustrmaps';
  script.async = true;
  script.src = container.dataset.scriptSrc;
  script.addEventListener('load', checkMap);
  script.addEventListener('error', unavailable);
  timeout = setTimeout(unavailable, 10000);
  slot.appendChild(script);
})();
