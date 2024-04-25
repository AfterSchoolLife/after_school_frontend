'use client'
import Link from "next/link"
import Button from '@mui/material/Button';
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useContext, useState } from "react";
import { UserContext } from "./root";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Navbar = () => {
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div>
                {userDetails.isLoggedin && <Badge className="shopping-card-button" badgeContent={userDetails.cart.data.length} color="primary">
                    <Link href="/shop/cart">
                        <Button variant="contained" color="primary4">
                            <ShoppingCartIcon fontSize="large"></ShoppingCartIcon>
                        </Button>
                    </Link>
                </Badge>}
            </div>
            <nav className="top-nav">
                <div>
                    <Link href="/"><img alt="Logo" src={`/logo.jpeg`} /></Link>
                </div>
                <div className="flex gap-6 p-4 items-center">
                    <Link href="/">
                        <Button variant="contained" color="primary">
                            Home
                        </Button>
                    </Link>
                    <Link href="/program">
                        <Button variant="contained" color="primary2">
                            Programs
                        </Button>
                    </Link>
                    <Link href="/school">
                        <Button variant="contained" color="primary3">
                            Schools
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="contained" color="primary4">
                            Shop
                        </Button>
                    </Link>
                    <Link href="/work">
                        <Button variant="contained" color="primary5">
                            Work with Us
                        </Button>
                    </Link>
                    {userDetails.isLoggedin ?
                        <div>
                            <IconButton id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick} className="round-button">
                                <AccountCircleIcon fontSize="large"></AccountCircleIcon>
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
                                <Link href='/profile/details'><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
                                {userDetails.role == 'admin' && <Link href='/admin/programs'><MenuItem onClick={handleClose}>Admin</MenuItem></Link>}
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                        :
                        <Link href="/login">
                            <Button variant="contained" color="primary6">
                                Login
                            </Button>
                        </Link>}
                </div>
            </nav>
        </>
    )
}

export default Navbar