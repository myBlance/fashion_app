// components/DynamicBreadcrumbs.tsx
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

export default function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs separator=">" aria-label="breadcrumb" sx={{ my: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Trang chủ
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={to} color="darkred" fontWeight="bold">
            {capitalize(value)}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={to}
            key={to}
            underline="hover"
            color="inherit"
          >
            {capitalize(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
