import { pageMetadata } from '@/lib/seo';
import { ProjectsPage } from '@/views/ProjectsPage';

export const metadata = pageMetadata('ru', 'projects');

export default function Page() {
  return <ProjectsPage lang="ru" />;
}
