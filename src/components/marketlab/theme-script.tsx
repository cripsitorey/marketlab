export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('marketlab-theme');
        var theme = stored;
        if (theme !== 'light' && theme !== 'dark') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (e) {}
    })();
  `;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap before paint
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
