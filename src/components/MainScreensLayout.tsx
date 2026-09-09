import { Outlet } from 'react-router';
import { useSidebar } from './ui/sidebar';
import SideBar from './SideBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MdOutlineMenu } from 'react-icons/md';
import { Button } from './ui/button';

export default function MainScreensLayout() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="min-w-full min-h-screen flex">
      {isMobile && (
        <Button variant="ghost" onClick={toggleSidebar} className="absolute top-4 left-4">
          <MdOutlineMenu className="size-8" />
        </Button>
      )}
      <SideBar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
