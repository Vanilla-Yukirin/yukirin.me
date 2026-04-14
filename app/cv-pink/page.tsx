import { getCVData } from '@/lib/data';
import CVPage from '@/components/CVPage';

export default async function CVPinkPage() {
  const data = await getCVData();
  return <CVPage data={data} theme="pink" />;
}
