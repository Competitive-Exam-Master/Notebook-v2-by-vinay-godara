export default function(editor) {
  const wrapper = document.createElement('div');
  const mainBtn = document.createElement('button');
  mainBtn.className = 'tool-btn';
  mainBtn.textContent = '📝 Text';

  // Show submenu on main button click
  mainBtn.onclick = () => {
    wrapper.innerHTML = '';
    wrapper.appendChild(backBtn);
    actions.forEach(btn => wrapper.appendChild(btn));
  };

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'tool-btn';
  backBtn.textContent = '🔙 Back';
  backBtn.onclick = () => {
    wrapper.innerHTML = '';
    wrapper.appendChild(mainBtn);
  };

  // Submenu buttons with emojis
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
    btn.onclick = () => {
      document.execCommand(cmd, false, value || null);
      editor.focus();
    };
    return btn;
  });

  wrapper.appendChild(mainBtn);
  return wrapper;
}
