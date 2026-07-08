export default function ChatHeader() {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="w-3 h-3 rounded-full bg-fifa-green animate-pulse" aria-hidden="true" />
      <h3 className="font-semibold text-gray-900 dark:text-white">FIFA Operations AI</h3>
    </div>
  );
}
