import { getCVData } from '@/lib/data';
import CVPage from '@/components/CVPage';

export default async function CVBluePage() {
  const data = await getCVData();
  return <CVPage data={data} theme="blue" />;
}
