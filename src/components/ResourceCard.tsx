import { Card } from '@/components/ui/card';
import { FileText, Link as LinkIcon, FileArchive, File } from 'lucide-react';

const HUES = {
  red: 'text-red-600 dark:text-red-400 bg-red-600/10 dark:bg-red-400/10 border border-red-600/20 dark:border-red-400/20',
  indigo: 'text-primary bg-primary/10 border border-primary/20',
  neutral:
    'text-gray-600 dark:text-gray-400 bg-gray-600/10 dark:bg-gray-400/10 border border-gray-600/20 dark:border-gray-400/20',
} as const;

function getResourceMeta(mime: string) {
  if (mime === 'application/pdf') {
    return { icon: FileText, color: HUES.red };
  }
  if (mime === 'text/html') {
    return { icon: LinkIcon, color: HUES.indigo };
  }
  if (mime === 'application/zip') {
    return { icon: FileArchive, color: HUES.neutral };
  }
  return { icon: File, color: HUES.neutral };
}

export default function ResourceCard({
  resource,
}: {
  resource: { name: string; url: string; mime: string; description: string };
}) {
  const { icon: Icon, color } = getResourceMeta(resource.mime);

  return (
    <a href={resource.url} target="_blank" rel="noreferrer">
      <Card className="flex flex-row items-center gap-3 p-4 hover:bg-muted">
        <div className={`p-2 shrink-0 rounded-md ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium truncate">{resource.name}</p>
          <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
        </div>
      </Card>
    </a>
  );
}
