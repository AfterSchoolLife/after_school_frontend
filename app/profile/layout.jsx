'use client'
import { UserContext } from "@components/root";
import { lilita } from "@components/themeregistry"
import { Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useLayoutEffect } from "react";
const sidenav = [{ label: 'Profile', href: '/profile/details' },{ label: 'Student', href: '/profile/students' }, { label: 'Order History', href: '/profile/orders' }]
const ProfileLayout = ({ children }) => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    useLayoutEffect(() => {
        if (!userDetails.isLoggedin) router.push('/')
    },[])
    return userDetails.isLoggedin && <section className={lilita.variable}>
        <h1 className="pl-4">Profile</h1>
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
                    {sidenav.map((list_items, index) => (
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

export default ProfileLayout;