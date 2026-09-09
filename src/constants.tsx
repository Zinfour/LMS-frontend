import {
  MdOutlinePermIdentity,
  MdOutlineLibraryBooks,
  MdOutlineGridView,
  MdOutlineCalendarToday,
  MdOutlineArticle,
  MdOutlineGroups2,
  MdOutlineToc,
  MdOutlineSettings,
} from 'react-icons/md';

export const NAV_LINKS = {
  student: [
    {
      label: 'Overview',
      link: '/',
      icon: <MdOutlineGridView className="size-6" />,
    },
    {
      label: 'My Course',
      link: '/my-course',
      icon: <MdOutlineLibraryBooks className="size-6" />,
    },
    {
      label: 'Calendar',
      link: '/calendar',
      icon: <MdOutlineCalendarToday className="size-6" />,
    },
    {
      label: 'Resources',
      link: '/resources',
      icon: <MdOutlineArticle className="size-6" />,
    },
    {
      label: 'Profile',
      link: '/profile',
      icon: <MdOutlinePermIdentity className="size-6" />,
    },
  ],
  teacher: [
    {
      label: 'Overview',
      link: '/',
      icon: <MdOutlineGridView className="size-6" />,
    },
    {
      label: 'Courses',
      link: '/courses',
      icon: <MdOutlineLibraryBooks className="size-6" />,
    },
    {
      label: 'Students',
      link: '/students',
      icon: <MdOutlineGroups2 className="size-6" />,
    },
    {
      label: 'Content',
      link: '/content',
      icon: <MdOutlineArticle className="size-6" />,
    },
    {
      label: 'Resources',
      link: '/resources',
      icon: <MdOutlineToc className="size-6" />,
    },
    {
      label: 'Settings',
      link: '/settings',
      icon: <MdOutlineSettings className="size-6" />,
    },
  ],
};

export const API_BASE_URL = 'https://localhost:7108/api';
