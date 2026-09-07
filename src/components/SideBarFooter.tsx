import { Separator } from './ui/separator';
import { SidebarFooter as ShadCnSidebarFooter, SidebarMenuItem } from './ui/sidebar';
import { useStore } from '@/hooks/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MdOutlineLogout, MdOutlineNavigateNext, MdOutlinePermIdentity, MdOutlineSettings } from 'react-icons/md';

const UserCard = ({ imageURL, username, role }: { imageURL?: string; username: string; role: string }) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="w-10 h-10 rounded-full overflow-hidden min-w-10">
        {imageURL ? (
          <img src={imageURL} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <span className="font-bold text-muted-foreground">{username[0]}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col select-none">
        <span className="line-clamp-2">{username}</span>
        <span className="text-xs text-muted-foreground capitalize">{role}</span>
      </div>
    </div>
  );
};

export default function SideBarFooter() {
  const isMobile = useIsMobile();
  const {
    user: { username, imageURL, role },
    logUserOut,
  } = useStore((state) => ({
    user: state.user!,
    logUserOut: state.logUserOut,
  }));

  const handleLogout = () => {
    logUserOut();
  };

  return (
    <>
      <Separator className="h-px" />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ShadCnSidebarFooter className="mx-2 my-2 px-2 py-2 hover:bg-muted rounded-lg text-left ">
            <SidebarMenuItem className="flex flex-row items-center justify-between ">
              <UserCard imageURL={imageURL} username={username} role={role} />
              <MdOutlineNavigateNext className="size-5" />
            </SidebarMenuItem>
          </ShadCnSidebarFooter>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={-5}>
          <div className="px-2 py-4 text-left">
            <UserCard imageURL={imageURL} username={username} role={role} />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 flex items-center gap-2">
              <MdOutlinePermIdentity className="size-5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 flex items-center gap-2">
              <MdOutlineSettings className="size-5" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="py-3 flex items-center gap-2">
            <MdOutlineLogout className="size-5" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
