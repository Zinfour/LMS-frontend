import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';

export default function About() {
  const { count, increaseCount } = useStore((state) => ({
    count: state.count,
    increaseCount: state.increaseCount,
  }));
  return (
    <div>
      About Page
      <h1>Count: {count}</h1>
      <Button onClick={increaseCount}>Increase Count</Button>
    </div>
  );
}
