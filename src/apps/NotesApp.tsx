export const NotesApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-os-surface p-3 text-sm">
      <div className="text-xs text-os-text-muted mb-2">
        Basic note app — content not persistent yet.
      </div>
      <textarea
        className="
          w-full h-full
          bg-os-bg-alt
          border border-os-border
          rounded-md p-2
          text-xs
          focus:outline-none focus:ring-1 focus:ring-os-accent
          resize-none
        "
        data-cursor="text" 
        placeholder="Write your notes here..."
      />
    </div>
  );
};
