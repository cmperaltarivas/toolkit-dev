export function parseBookmarksHtml(content) {
  const tools = [];
  let currentCategory = 'Importados';
  const lines = content.split('\n');
  for (const line of lines) {
    const catMatch = line.match(/<H3[^>]*>(.*?)<\/H3>/i);
    if (catMatch) { currentCategory = catMatch[1].trim(); continue; }
    const linkMatch = line.match(/<A HREF="([^"]*)"[^>]*>(.*?)<\/A>/i);
    if (linkMatch) {
      const url = linkMatch[1];
      const name = linkMatch[2].trim();
      if (url && name && !url.startsWith('place:')) {
        tools.push({ name, url, category: currentCategory });
      }
    }
  }
  return tools;
}
