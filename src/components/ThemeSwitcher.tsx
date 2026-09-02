import { cn } from '@/lib/utils';
import { usePersistentStore } from '../hooks/usePersistentStore';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';

export default function ThemeSwitcher() {
  const { theme, setTheme } = usePersistentStore((state) => ({ theme: state.theme, setTheme: state.setTheme }));
  return (
    <div className="flex bg-muted rounded-lg border border-muted-foreground/50 overflow-hidden relative max-w-40">
      <div
        style={{ transform: `translateX(${theme === 'light' ? '0%' : '100%'})` }}
        className="absolute top-0 left-0 w-[50%] h-full bg-muted-foreground/30 transition-transform duration-300 rounded-lg border-3 border-muted"
      />
      <input
        id="light"
        type="radio"
        name="theme"
        value="light"
        checked={theme === 'light'}
        onChange={() => setTheme('light')}
        className="hidden"
      />
      <label htmlFor="light" className="px-4 py-2 z-10 flex-1 flex justify-center">
        <MdOutlineLightMode className={cn('size-6', theme === 'light' ? 'opacity-100' : 'opacity-50')} />
      </label>

      <input
        id="dark"
        type="radio"
        name="theme"
        value="dark"
        checked={theme === 'dark'}
        onChange={() => setTheme('dark')}
        className="hidden"
      />
      <label htmlFor="dark" className="px-4 py-2 z-10 flex-1 flex justify-center">
        <MdOutlineDarkMode className={cn('size-6', theme === 'dark' ? 'opacity-100' : 'opacity-50')} />
      </label>
    </div>
  );
}
