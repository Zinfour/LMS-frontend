import type { ReactNode } from 'react';
import { FileText, Link as LinkIcon, FileArchive, File } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

function guessMime(url: string) {
  if (url.endsWith('.zip')) {
    return 'application/zip';
  } else if (url.endsWith('.pdf')) {
    return 'application/pdf';
  }
  return 'text/html';
}

interface Props {
  resource: {
    name: string;
    url: string;
    mime?: string;
    description: string;
  };
  editDialog?: ReactNode;
}

export default function ResourceCard({ resource, editDialog }: Props) {
  const { icon: Icon, color } = getResourceMeta(resource.mime ?? guessMime(resource.url));

  return (
    <Card className="relative max-w-100 p-0">
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className={`flex flex-row items-center gap-3 p-2 ${editDialog ? 'pr-12' : ''} hover:bg-muted`}>
        <div className={`shrink-0 rounded-md p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium" title={resource.name}>
            {resource.name}
          </p>
          <p className="truncate text-sm text-muted-foreground" title={resource.description}>
            {resource.description}
          </p>
        </div>
      </a>

      {editDialog}
    </Card>
  );
}
