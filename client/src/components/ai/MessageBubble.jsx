import { sanitizeHTML } from '../../utils/sanitize';

/**
 * Parse basic markdown into sanitized HTML elements
 */
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let content = line;
    // Bold **bold**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-text-primary">$1</strong>');

    const sanitized = sanitizeHTML(content);

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <li key={idx} className="list-disc list-inside ml-2.5 text-xs text-text-secondary my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHTML(content.substring(2)) }} />
      );
    }
    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="list-decimal list-inside ml-2.5 text-xs text-text-secondary my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHTML(numMatch[2]) }} />
      );
    }
    return (
      <p key={idx} className="text-xs text-text-secondary leading-relaxed mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: sanitized }} />
    );
  });
}

export default function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`group relative max-w-[80%] p-4.5 rounded-2xl border ${
        isUser
          ? 'bg-accent/10 border-accent/20 text-text-primary rounded-tr-none'
          : 'bg-surface-secondary border-border/40 text-text-secondary rounded-tl-none'
      }`}>
        {isUser ? (
          <p className="text-xs font-semibold leading-relaxed">{message.content}</p>
        ) : (
          <div className="space-y-1">
            {parseMarkdown(message.content)}
          </div>
        )}

        {/* Copy button */}
        {!isUser && onCopy && (
          <button
            onClick={() => onCopy(message.content)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-muted hover:text-text-primary"
            title="Copy response"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
