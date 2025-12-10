export const TerminalApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-black text-green-400 font-mono text-xs p-2">
      <div className="mb-1 opacity-70">
        Experimental shell — not interactive yet.
      </div>
      <pre>&gt;_ hello world</pre>
    </div>
  );
};
