export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="bg-surface-secondary border border-border/40 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
