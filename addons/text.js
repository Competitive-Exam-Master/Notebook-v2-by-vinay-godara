export default function(editor) {
  const wrapper = document.createElement('div');
  let savedRange = null;

  // Preserve selection on mouseup
  editor.addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  });

  const mainBtn = document.createElement('button');
  mainBtn.className = 'tool-btn';
  mainBtn.textContent = '📝 Text';
  mainBtn.style.touchAction = 'manipulation';

  mainBtn.onclick = (e) => {
    e.preventDefault();
    wrapper.innerHTML = '';
    wrapper.appendChild(backBtn);
    actions.forEach(btn => wrapper.appendChild(btn));
  };

  const backBtn = document.createElement('button');
  backBtn.className = 'tool-btn';
  backBtn.textContent = '🔙 Back';
  backBtn.style.touchAction = 'manipulation';

  backBtn.onclick = (e) => {
    e.preventDefault();
    wrapper.innerHTML = '';
    wrapper.appendChild(mainBtn);
  };

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

    btn.onclick = (e) => {
      e.preventDefault();
      if (savedRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }
      document.execCommand(cmd, false, value || null);
      editor.focus();
    };

    return btn;
  });

  wrapper.appendChild(mainBtn);
  return wrapper;
}
