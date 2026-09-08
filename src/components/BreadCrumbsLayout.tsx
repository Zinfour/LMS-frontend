import { Outlet, useLocation, matchRoutes, Link } from 'react-router';
import React, { useEffect, useState, type JSX } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';

interface Props {
  routes: {
    path: string;
    crumb: () => string | JSX.Element;
  }[];
}

export default function BreadCrumbsLayout({ routes }: Props) {
  const isMobile = useIsMobile();
  const [breadcrumbs, setBreadcrumbs] = useState<{ path: string; crumb: () => string | JSX.Element }[]>([]);
  const location = useLocation();

  useEffect(() => {
    const matchedRoute = matchRoutes(routes, location)?.[0]; // Take the current route and try to match it in the array of routes from props.

    if (matchedRoute) {
      const breadcrumbs = routes
        .filter((route) => {
          // Only take the routes that are part of the current matched route (ex: '/my-course/:moduleId' will include '/my-course' and /my-course/:moduleId but not /my-course/:moduleId/:activityId)
          return matchedRoute.route.path.includes(route.path);
        })
        .map((route) => {
          const routeCopy = { ...route };
          if (Object.keys(matchedRoute.params).length > 0) {
            // Check if the route has params (ex: '/my-course/:moduleId') and replace the :moduleId with the actual value
            Object.keys(matchedRoute.params).forEach((param) => {
              routeCopy.path = routeCopy.path.replace(`:${param}`, matchedRoute.params[param] as string);
            });
          }

          return routeCopy;
        });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBreadcrumbs(breadcrumbs);
    }
  }, [location, routes]);

  return (
    <div className="px-5 py-4">
      <Breadcrumb className={`mb-5 ${isMobile ? 'ml-15 pt-2 mb-8' : ''}`}>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={breadcrumb.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{breadcrumb.crumb()}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={breadcrumb.path}>{breadcrumb.crumb()}</Link>} />
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}

/*
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost"><BreadcrumbEllipsis /><span className="sr-only">Toggle menu</span></Button>} />
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
*/
