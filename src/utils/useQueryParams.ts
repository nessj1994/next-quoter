import { useRouter } from 'next/router';

export default function useQuery() {
  const router = useRouter();
  console.log(router.query);
  return router.query;
}
