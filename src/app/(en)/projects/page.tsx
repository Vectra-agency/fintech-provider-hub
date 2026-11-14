import { pageMetadata } from '@/lib/seo';
import { ProjectsPage } from '@/views/ProjectsPage';

export const metadata = pageMetadata('en', 'projects');

export default function Page() {
  return <ProjectsPage lang="en" />;
}
