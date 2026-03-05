import type { Route } from "../+types/home"

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return(
        <>
            <h1 className="my-8 text-center font-bold text-4xl">Account Settings</h1>

            <h2 className="mx-16 mb-4 font-bold text-xl">My profile:</h2>

            <div className="mx-16">
                <img src="/image400.png" alt="Profile picture" className="w-40"/>
                <table className="table-auto my-4">
                    <tbody>
                        <tr>
                            <td className="font-bold">Name:&nbsp;</td>
                            <td>Martin Poboril</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Age:&nbsp;</td>
                            <td>26 years old</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Sex:&nbsp;</td>
                            <td>Male</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Membership:&nbsp;</td>
                            <td>Free membership</td>
                            <td className="ml-8">
                                <button type="button"
                                        className="text-white ml-8 bg-yellow-400 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Subscripe
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h2 className="mb-4 font-bold text-xl">About Me:</h2>

                <p className="font-bold">My favorite food:</p>
                <p>I love Italian and Czech food</p>
                <p className="mt-4 font-bold">My favorite restaurant:</p>
                <p>Farm to Table, Range Cafe, Linda Coffee</p>

                <button type="button"
                        className="text-white mt-4 bg-blue-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Edit Profile
                </button>
            </div>

            <div className="mx-16">
                <h2 className="mt-16 font-bold text-xl">Change Password</h2>

                    <div className="relative my-4 pr-200">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                        <input type="text" id="input-group-1"
                               className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                               placeholder="Current Password"/>
                    </div>

                    <div className="relative my-4 pr-200">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                        <input type="text" id="input-group-1"
                               className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                               placeholder="New Password"/>
                    </div>

                    <div className="relative my-4 pr-200">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                        <input type="text" id="input-group-1"
                               className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                               placeholder="Re-type Password"/>
                    </div>

                <button type="button"
                        className="text-white mt-4 bg-blue-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Save Password
                </button>
            </div>

            <div className="mx-16">
                <h2 className="mt-16 font-bold text-xl">Change Email:</h2>
                <table className="table-auto my-4">
                    <tbody>
                    <tr>
                        <td className="font-bold">Current Email:&nbsp;</td>
                        <td>marpob@gmail.com</td>
                    </tr>
                    </tbody>
                </table>
                <div className="relative my-4 pr-200">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                    <input type="text" id="input-group-1"
                           className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                           placeholder="New Email"/>
                </div>
                <button type="button"
                        className="text-white mt-4 bg-blue-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Save Email
                </button>
            </div>

            <div className="mx-16">
                <h2 className="mt-16 font-bold text-xl">Change Username:</h2>
                <table className="table-auto my-4">
                    <tbody>
                    <tr>
                        <td className="font-bold">Current Email:&nbsp;</td>
                        <td>marpob39</td>
                    </tr>
                    </tbody>
                </table>
                <div className="relative my-4 pr-200">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                    <input type="text" id="input-group-1"
                           className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                           placeholder="New Username"/>
                </div>
                <button type="button"
                        className="text-white mt-4 bg-blue-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Save Username
                </button>
            </div>

            <div className="mx-16 my-16">
            <button type="button"
                    className="text-white mt-4 bg-red-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Delete Account
            </button>
            </div>

        </>
    )
}
