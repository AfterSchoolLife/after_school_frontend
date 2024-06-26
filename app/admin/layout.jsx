'use client'
import { UserContext } from "@components/root";
import { lilita } from "@components/themeregistry"
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useLayoutEffect } from "react";
const sidenav_super_admin = [{ label: 'Programs', href: '/admin/programs' },
{ label: 'Schools', href: '/admin/schools' }, { label: 'Schedules', href: '/admin/schedules' },
{ label: 'Products', href: '/admin/products' }, { label: 'Job Applications', href: '/admin/jobapplication' },
{ label: 'Purchase History', href: '/admin/purchases' }, { label: 'Create Admin', href: '/admin/create_admin' },
{ label: 'Send Notification', href: '/admin/send_email' }
]
const sidenav_admin = [{ label: 'Programs', href: '/admin/programs' },
{ label: 'Schools', href: '/admin/schools' }, { label: 'Schedules', href: '/admin/schedules' },
{ label: 'Products', href: '/admin/products' }
]
const AdminLayout = ({ children }) => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    useLayoutEffect(() => {
        if (!(userDetails.isLoggedin && (userDetails.role == 'admin' || userDetails.role == 'super-admin'))) {
            router.push('/')
        }
    }, [])
    return userDetails.isLoggedin && (userDetails.role == 'admin' || userDetails.role == 'super-admin') && <section className={lilita.variable}>
        <h1 className="pl-4">{userDetails.role == 'admin' ? 'Admin': 'Super Admin'}</h1>
        <div className="flex gap-4">
            <Drawer
                sx={{
                    width: '240px',
                    height: 'calc(100vh - 136px)',
                    position: 'relative',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '240px',
                        boxSizing: 'border-box',
                        position: 'absolute',
                        background: 'var(--secondary-background)',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    {userDetails.role == 'super-admin' ? sidenav_super_admin.map((list_items, index) => (
                        <ListItem key={index} >
                            <Link className="w-full" href={list_items.href}>
                                <ListItemButton>
                                    <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    )) : sidenav_admin.map((list_items, index) => (
                        <ListItem key={index} >
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
}

export default AdminLayout;