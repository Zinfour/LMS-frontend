import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/useStore';

export default function Home() {
  const { count, increaseCount, decreaseCount } = useStore((state) => ({
    count: state.count,
    increaseCount: state.increaseCount,
    decreaseCount: state.decreaseCount,
  }));
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <h1>The counter is: {count}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 pt-12">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing
              elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button onClick={increaseCount} className="w-[80%] mx-auto py-6">
              Click Me
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button onClick={decreaseCount} className="w-[80%] mx-auto py-6" variant="destructive">
              Delete Me
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
