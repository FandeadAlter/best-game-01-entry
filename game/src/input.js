export function createInput(canvas, actions) {
  const state = { x: 880, y: 260, focus: false, keys: new Set(), horn: false };
  const point = event => {
    const rect = canvas.getBoundingClientRect();
    state.x = (event.clientX - rect.left) * canvas.width / rect.width;
    state.y = (event.clientY - rect.top) * canvas.height / rect.height;
  };
  canvas.addEventListener('pointermove', point);
  canvas.addEventListener('pointerdown', event => {
    point(event);
    state.focus = event.button === 0;
    actions.pointer?.(state.x, state.y);
  });
  window.addEventListener('pointerup', () => { state.focus = false; });
  window.addEventListener('keydown', event => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    if (state.keys.has(event.code)) return;
    state.keys.add(event.code);
    if (event.code === 'Space') state.focus = true;
    if (event.code === 'KeyH') actions.horn?.();
    if (event.code === 'KeyM') actions.mute?.();
    if (event.code === 'KeyP' || event.code === 'Escape') actions.pause?.();
    if (event.code === 'KeyR') actions.restart?.();
    if (event.code === 'Enter') actions.confirm?.();
  });
  window.addEventListener('keyup', event => {
    state.keys.delete(event.code);
    if (event.code === 'Space') state.focus = false;
  });
  canvas.addEventListener('click', event => { point(event); actions.pointer?.(state.x, state.y); });
  return state;
}
