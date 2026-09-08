import { Separator } from './ui/separator';
import { Sidebar as ShadCnSidebar, SidebarContent, SidebarHeader, useSidebar } from './ui/sidebar';
import SideBarFooter from './SideBarFooter';
import Link from './SideBarLink';
import { useStore } from '@/hooks/useStore';
import { NAV_LINKS } from '@/constants';
import { MdOutlineCheckBoxOutlineBlank, MdOutlineClose } from 'react-icons/md';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import ThemeSwitcher from './ThemeSwitcher';

export default function SideBar() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { role } = useStore((state) => state.user!);
  const links = role === 'student' ? NAV_LINKS.student : NAV_LINKS.teacher;

  return (
    <ShadCnSidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-6 mb-4">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="px-1.5 py-1.5 rounded-lg bg-[rgb(47,75,217)]">
              <MdOutlineCheckBoxOutlineBlank className="size-5 color-white fill-white" />
            </div>
            <span className="text-xl font-medium">Kursportalen</span>
          </div>
          {isMobile && (
            <Button variant="ghost" onClick={toggleSidebar}>
              <MdOutlineClose className="size-6 fill-muted-foreground" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <nav className="flex flex-col gap-2">
          {links.map(({ link, label, icon }) => (
            <Link key={link} to={link} label={label} icon={icon} />
          ))}
        </nav>
        <Separator className="my-8 h-px" />
        <div className="flex items-center justify-center">
          <ThemeSwitcher />
        </div>
      </SidebarContent>
      <SideBarFooter />
    </ShadCnSidebar>
  );
}
