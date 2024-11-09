'use client'
import { UserContext } from "@components/root";
import { lilita } from "@components/themeregistry";
import { Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useLayoutEffect } from "react";

const sidenav = [
  { label: 'Profile', href: '/profile/details' },
  { label: 'Student', href: '/profile/students' },
  { label: 'Order History', href: '/profile/orders' }
];

const ProfileLayout = ({ children }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useContext(UserContext);

  useLayoutEffect(() => {
    if (!userDetails.isLoggedin) router.push('/');
  }, []);

  return userDetails.isLoggedin && (
    <section className={lilita.variable}>
      <h1 className="pl-4">Profile</h1>
      <div className="flex gap-4">
        <Drawer
          sx={{
            width: '240px',  // Default width for larger screens
            height: 'calc(100vh - 136px)',
            position: 'relative',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '240px',  // Paper width matching the drawer width
              boxSizing: 'border-box',
              position: 'absolute',
              background: 'var(--secondary-background)',
            },
            // Make drawer even smaller on small screens (e.g., for sm screens)
            '@media (max-width: 600px)': {
              width: '80px',  // Further reduced width for smaller screens (80px)
              '& .MuiDrawer-paper': {
                width: '80px',  // Paper width matching the drawer width
              }
            }
          }}
          variant="permanent"
          anchor="left"
        >
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%', // Ensure it takes full width for centering
            }}
          >
            {sidenav.map((list_items, index) => (
              <ListItem
                key={index}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingLeft: '16px', // Default left padding
                  '@media (max-width: 600px)': {
                    paddingLeft: '0px', // Set paddingLeft to 0 on smaller screens
                  }
                }}
              >
                <Link className="w-full" href={list_items.href}>
                  <ListItemButton>
                    <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <div className="w-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export default ProfileLayout;
