interface Source {
  document_name: string;
  page_number: number;
}

export default function SourceBadge({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-950 border border-blue-800 text-blue-300 text-xs rounded-full px-2.5 py-0.5">
      <span className="opacity-60">p.{source.page_number}</span>
      <span className="truncate max-w-32">{source.document_name}</span>
    </span>
  );
}