import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

// Define a custom Link component that forwards refs to RouterLink and supports onClick
const CustomLink = React.forwardRef<HTMLAnchorElement, { to: string; onClick?: () => void }>(
  ({ to, onClick, ...rest }, ref) => (
    <RouterLink ref={ref} to={to} {...rest} onClick={onClick} />
  )
);

// Sidebar component
const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const sidebarContent = (
    <div
      style={{
        width: 250,
        backgroundColor: 'black',
        color: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List>
        {[
          { text: 'Dashboard', path: '/dashboard' },
          { text: 'Day Report', path: '/dayreport' },
          { text: 'Last 7 Days', path: '/Last7Days' },
          { text: 'Monthly Report', path: '/MonthlyReport' },
          { text: 'Pending Amount Report', path: '/PendingAmounts' },
          { text: 'Generate Invoice', path: '/InvoiceGenerate' },
          { text: 'Upload Bookings', path: '/UploadPage' },
          { text: 'Config Manager', path: '/ConfigManager' },
          { text: 'Address Book', path: '/AddressBook' },
          { text: 'Inv Test', path: '/InvoiceGenerateTest' },
        ].map((item) => (
          <ListItem
            key={item.text}
            component={CustomLink}
            to={item.path}
            style={{ color: 'white' }}
            onClick={handleMenuClick}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <div
        style={{
          height: '150px',
          backgroundColor: 'black',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/images/fico.jpeg" // Reference image from the public folder
          alt="Logo"
          style={{ width: '100px', height: 'auto' }}
        />
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={() => toggleDrawer(true)}
            style={{
              position: 'fixed',
              top: 10,
              left: 10,
              color: 'Grey',
              zIndex: 1000,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
            PaperProps={{
              style: { backgroundColor: 'black', color: 'white' },
            }}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <div style={{ width: 250, backgroundColor: 'black', color: 'white', height: '100vh' }}>
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;
