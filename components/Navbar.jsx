'use client'
import Link from "next/link";
import Button from '@mui/material/Button';
import { Badge, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Fragment, useContext, useState } from "react";
import { UserContext } from "./root";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        localStorage.clear();
        location.reload();
    };

    return (
        <Fragment>
            <div>
                {userDetails.isLoggedin && (
                    <Badge className="shopping-card-button" badgeContent={userDetails.cart.data.length} color="primary">
                        <Link href="/shop/cart">
                            <Button variant="contained" color="primary4">
                                <ShoppingCartIcon fontSize="large" />
                            </Button>
                        </Link>
                    </Badge>
                )}
            </div>
            <nav className="top-nav">
                <div className="flex items-center justify-between w-full p-4">
                    <Link href="/">
                        <img alt="Logo" src={`/logo.jpeg`} className="h-8 md:h-12" />
                    </Link>
                    {/* Hamburger icon for small screens */}
                    <IconButton 
                        className="md:invisible" 
                        onClick={() => setDrawerOpen(true)} 
                        color="primary"
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Navigation links for larger screens */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/">
                            <Button variant="contained" color="primary">Home</Button>
                        </Link>
                        <Link href="/school">
                            <Button variant="contained" color="primary3">Schools</Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="contained" color="primary4">Shop</Button>
                        </Link>
                        <Link href="/work">
                            <Button variant="contained" color="primary5">Work with Us</Button>
                        </Link>
                        {userDetails.isLoggedin ? (
                            <div>
                                <IconButton
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    className="round-button"
                                >
                                    <AccountCircleIcon fontSize="large" />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <Link href='/profile/details'>
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    </Link>
                                    {(userDetails.role === 'admin' || userDetails.role === 'super-admin') && (
                                        <Link href='/admin/programs'>
                                            <MenuItem onClick={handleClose}>Admin</MenuItem>
                                        </Link>
                                    )}
                                    <MenuItem onClick={logout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <Link href="/auth/login">
                                <Button variant="contained" color="primary6">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Drawer for Mobile Menu */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <List className="w-64">
                    <ListItem button component={Link} href="/">
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} href="/school">
                        <ListItemText primary="Schools" />
                    </ListItem>
                    <ListItem button component={Link} href="/shop">
                        <ListItemText primary="Shop" />
                    </ListItem>
                    <ListItem button component={Link} href="/work">
                        <ListItemText primary="Work with Us" />
                    </ListItem>
                    {userDetails.isLoggedin ? (
                        <>
                            <ListItem button component={Link} href="/profile/details">
                                <ListItemText primary="Profile" />
                            </ListItem>
                            {(userDetails.role === 'admin' || userDetails.role === 'super-admin') && (
                                <ListItem button component={Link} href="/admin/programs">
                                    <ListItemText primary="Admin" />
                                </ListItem>
                            )}
                            <ListItem button onClick={logout}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </>
                    ) : (
                        <ListItem button component={Link} href="/auth/login">
                            <ListItemText primary="Login" />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </Fragment>
    );
};

export default Navbar;
