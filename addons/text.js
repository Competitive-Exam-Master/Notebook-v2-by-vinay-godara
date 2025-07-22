export default function(editor) {
  const wrapper = document.createElement('div');
  let savedRange = null;

  // Inline logging panel
  const debug = document.createElement('div');
  debug.id = 'debug-console';
  debug.style.position = 'fixed';
  debug.style.bottom = '65px';
  debug.style.left = '0';
  debug.style.width = '100%';
  debug.style.maxHeight = '120px';
  debug.style.overflowY = 'auto';
  debug.style.fontSize = '12px';
  debug.style.fontFamily = 'monospace';
  debug.style.background = '#222';
  debug.style.color = '#0f0';
  debug.style.padding = '6px';
  debug.style.zIndex = 9999;
  document.body.appendChild(debug);

  const log = (msg) => {
    console.log(msg);
    debug.innerHTML += `<div>${msg}</div>`;
    debug.scrollTop = debug.scrollHeight;
  };

  // Selection tracking
  const updateSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange();
      log('✅ Selection saved.');
    } else {
      log('⚠️ No selection available.');
    }
  };

  const restoreSelection = () => {
    try {
      if (savedRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRange);
        log('🔄 Selection restored.');
      } else {
        throw new Error('❌ savedRange is null. Cannot restore selection.');
      }
    } catch (err) {
      console.error(err);
      log(`💥 Error restoring selection: ${err.message}`);
    }
  };

  ['mouseup', 'keyup', 'input', 'focus', 'touchend'].forEach(evt =>
    editor.addEventListener(evt, () => {
      log(`🕵️ Event: ${evt}`);
      updateSelection();
    })
  );

  const mainBtn = document.createElement('button');
  mainBtn.className = 'tool-btn';
  mainBtn.textContent = '📝 Text';
  mainBtn.style.touchAction = 'manipulation';

  mainBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    log('🔘 Main button pressed.');
    restoreSelection();
    wrapper.innerHTML = '';
    wrapper.appendChild(backBtn);
    actions.forEach(btn => wrapper.appendChild(btn));
    setTimeout(() => editor.focus({ preventScroll: true }), 0);
  });

  const backBtn = document.createElement('button');
  backBtn.className = 'tool-btn';
  backBtn.textContent = '🔙 Back';
  backBtn.style.touchAction = 'manipulation';

  backBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    log('🔘 Back button pressed.');
    restoreSelection();
    wrapper.innerHTML = '';
    wrapper.appendChild(mainBtn);
    setTimeout(() => editor.focus({ preventScroll: true }), 0);
  });

  const actions = [
    { label: 'Bold', emoji: '🔠', cmd: 'bold' },
    { label: 'Italic', emoji: '✍️', cmd: 'italic' },
    { label: 'Underline', emoji: '🖍️', cmd: 'underline' },
    { label: 'Heading 1', emoji: '🔷', cmd: 'formatBlock', value: 'h1' },
    { label: 'Heading 2', emoji: '🔹', cmd: 'formatBlock', value: 'h2' },
    { label: 'Heading 3', emoji: '◾', cmd: 'formatBlock', value: 'h3' }
  ].map(({ label, emoji, cmd, value }) => {
    const btn = document.createElement('button');
    btn.className = 'tool-btn';
    btn.textContent = `${emoji} ${label}`;
    btn.style.touchAction = 'manipulation';

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      log(`🧩 ${label} button pressed.`);
      try {
        restoreSelection();
        const success = document.execCommand(cmd, false, value || null);
        if (!success) throw new Error(`execCommand "${cmd}" failed.`);
        log(`✅ Command executed: ${cmd}`);
      } catch (err) {
        console.error(err);
        log(`💥 Error executing command: ${err.message}`);
      }
      setTimeout(() => editor.focus({ preventScroll: true }), 0);
    });

    return btn;
  });

  wrapper.appendChild(mainBtn);
  return wrapper;
}
