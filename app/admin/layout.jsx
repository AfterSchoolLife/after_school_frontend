'use client'

import { UserContext } from "@components/root"
import { lilita } from "@components/themeregistry"
import { Drawer, List, ListItem, ListItemButton, ListItemText, IconButton } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useLayoutEffect, useState } from "react"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

const sidenav_super_admin = [
    { label: 'Programs', href: '/admin/programs' },
    { label: 'Schools', href: '/admin/schools' },
    { label: 'Schedules', href: '/admin/schedules' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Job Applications', href: '/admin/jobapplication' },
    { label: 'Purchase History', href: '/admin/purchases' },
    { label: 'Create Admin', href: '/admin/create_admin' },
    { label: 'Send Notification', href: '/admin/send_email' }
]

const sidenav_admin = [
    { label: 'Programs', href: '/admin/programs' },
    { label: 'Schools', href: '/admin/schools' },
    { label: 'Schedules', href: '/admin/schedules' },
    { label: 'Products', href: '/admin/products' }
]

const AdminLayout = ({ children }) => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [drawerOpen, setDrawerOpen] = useState(false)

    useLayoutEffect(() => {
        if (!(userDetails.isLoggedin && (userDetails.role == 'admin' || userDetails.role == 'super-admin'))) {
            router.push('/')
        }
    }, [])

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    return userDetails.isLoggedin && (userDetails.role == 'admin' || userDetails.role == 'super-admin') && (
        <section className={lilita.variable}>
            <div className="relative">
                {/* Heading */}
                <h1 className="pl-4">{userDetails.role == 'admin' ? 'Admin' : 'Super Admin'}</h1>

                {/* Toggle Button (Arrow) */}
                <IconButton
                    sx={{
                        display: { xs: 'block', sm: 'none' }, // Only show on small screens
                        position: 'fixed', // Fixed position to stay in place
                        top: '50%', // Middle of the screen vertically
                        left: '0', // Left side of the screen
                        transform: 'translateY(-50%)', // To center the button vertically
                        zIndex: 1200, // Ensure it stays on top
                        backgroundColor: 'rgba(169, 169, 169, 0.5)', // Grey background with 50% opacity
                        borderRadius: '50%', // 50% rounded corners (circular shape)
                        padding: '8px', // Padding to make the button size appropriate
                    }}
                    onClick={toggleDrawer}
                >
                    {drawerOpen ? (
                        <ArrowBackIosIcon sx={{ color: 'var(--primary-color-1)' }} />
                    ) : (
                        <ArrowForwardIosIcon sx={{ color: 'var(--primary-color-1)' }} />
                    )}
                </IconButton>
            </div>

            <div className="flex gap-4">
                {/* Drawer for Larger Screens */}
                <Drawer
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'block' }, // Hide on small screens, show on larger screens
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            position: 'relative',
                            background: 'var(--secondary-background)',
                        },
                    }}
                    variant="permanent" // Always visible on larger screens
                    anchor="left"
                >
                    <List>
                        {userDetails.role == 'super-admin' ? 
                            sidenav_super_admin.map((list_items, index) => (
                                <ListItem key={index}>
                                    <Link className="w-full" href={list_items.href}>
                                        <ListItemButton>
                                            <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            )) : 
                            sidenav_admin.map((list_items, index) => (
                                <ListItem key={index}>
                                    <Link className="w-full" href={list_items.href}>
                                        <ListItemButton>
                                            <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))
                        }
                    </List>
                </Drawer>

                {/* Drawer for Smaller Screens */}
                <Drawer
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            position: 'relative',
                            background: 'var(--secondary-background)',
                        },
                    }}
                    variant="temporary" // Temporary drawer on smaller screens
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    ModalProps={{
                        keepMounted: true, // Improve performance on mobile
                    }}
                >
                    <List>
                        {userDetails.role == 'super-admin' ? 
                            sidenav_super_admin.map((list_items, index) => (
                                <ListItem key={index}>
                                    <Link className="w-full" href={list_items.href}>
                                        <ListItemButton>
                                            <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            )) : 
                            sidenav_admin.map((list_items, index) => (
                                <ListItem key={index}>
                                    <Link className="w-full" href={list_items.href}>
                                        <ListItemButton>
                                            <ListItemText sx={{ color: 'var(--primary-color-1)' }} primary={<p className="font-semibold">{list_items.label}</p>} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))
                        }
                    </List>
                </Drawer>

                {/* Content Area */}
                <div className="w-full pl-4">
                    {children}
                </div>
            </div>
        </section>
    )
}

export default AdminLayout
