import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

export function Navigation() {
    return (
        <Navbar fluid rounded className={'border-6 border-gray-200 bg-gray-100'}>
            <NavbarBrand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Our Great Meals</span>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>
                <NavbarLink href="/recipe">Recipes</NavbarLink>
                <NavbarLink href="/meals">Meals</NavbarLink>
                <NavbarLink href="/login">Login/New Account</NavbarLink>
                <NavbarLink href="/friends">Friends</NavbarLink>
                <NavbarLink href="#">Saved Recipes</NavbarLink>
                <NavbarLink href="#">My Account</NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
}