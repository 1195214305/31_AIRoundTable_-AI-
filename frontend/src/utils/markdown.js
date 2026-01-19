import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

// 自定义渲染器
const renderer = new marked.Renderer();

// 代码块渲染
renderer.code = (code, language) => {
  const validLanguage = language || 'plaintext';
  return `<pre><code class="language-${validLanguage}">${escapeHtml(code)}</code></pre>`;
};

// 行内代码渲染
renderer.codespan = (code) => {
  return `<code>${escapeHtml(code)}</code>`;
};

// 链接渲染（添加安全属性）
renderer.link = (href, title, text) => {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.use({ renderer });

// HTML转义
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 解析Markdown
export function parseMarkdown(markdown) {
  if (!markdown) return '';

  try {
    const html = marked.parse(markdown);
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'code', 'pre',
        'ul', 'ol', 'li',
        'blockquote',
        'a',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'src', 'alt']
    });
  } catch (error) {
    console.error('Markdown解析失败:', error);
    return escapeHtml(markdown);
  }
}

// 截断文本
export function truncateText(text, maxLength = 500) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 检测是否需要折叠
export function shouldCollapse(text, threshold = 500) {
  return text && text.length > threshold;
}

export default {
  parseMarkdown,
  truncateText,
  shouldCollapse
};
