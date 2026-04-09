import {
    Dropdown,
    MegaMenu,
    MegaMenuDropdown,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle
} from "flowbite-react";
import {Form} from "react-router";

type NavigationProps = { isLoggedIn: boolean }

export function Navigation({isLoggedIn}: NavigationProps) {
    return (
        <Navbar fluid rounded className={'border-6 border-gray-200 bg-gray-100'}>
            <NavbarBrand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Our Great Meals</span>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>
                {/*<NavbarLink href="/recipe">Recipes</NavbarLink>*/}
                <NavbarLink href="/meals">Meals</NavbarLink>
                {!isLoggedIn && (
                    <NavbarLink href="/login">Login/New Account</NavbarLink>
                )}
                {isLoggedIn && (
                    <>
                        <NavbarLink href="/allfriends">Friends</NavbarLink>
                        <NavbarLink href="/saved-recipes">Saved Recipes</NavbarLink>
                    </>
                )}
                {isLoggedIn && (
                    <Dropdown arrowIcon={true}
                              inline
                              label={
                                  'My Account'
                              }>
                        <ul className="grid grid-cols-1">
                            <div className="space-y-4 p-4">
                                <li>
                                    <a href='/accountset' className="hover:text-primary-600 dark:hover:text-primary-500">
                                        Settings
                                    </a>
                                </li>
                                <li>
                                    <Form method="post" action="/logout">
                                        <button
                                            type="submit"
                                            className="hover:text-primary-600 dark:hover:text-primary-500 bg-transparent border-0 p-0 cursor-pointer text-left"
                                        >
                                            Logout
                                        </button>
                                    </Form>
                                </li>
                            </div>
                        </ul>
                    </Dropdown>
                )}
            </NavbarCollapse>
        </Navbar>
    );
}