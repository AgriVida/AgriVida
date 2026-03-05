import React from "react";


export function FriendRequestCard(props: { friend: { image: string, name: string } }) {
    return (
        <>

            <div className="md:mx-0 mx-16 flex flex-col">
                <div className="md:mx-0 mx-16">
                    <img className="mb-2" src={props.friend.image} alt={props.friend.name}/>
                </div>
                <p className="p-4 font-bold text-3xl text-center flex-grow">{props.friend.name}</p>
                <div className="flex justify-center w-full gap-4">
                    <div className="w-1/2 b-4">
                        <button type="button"
                                className="mt-6 text-white bg-green-600 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Confirm
                        </button>
                    </div>
                    <div className="w-1/2 b-4">
                        <button type="button"
                                className="mt-6 text-white bg-red-600 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Decline
                        </button>
                    </div>
                </div>
            </div>


        </>
    )
}
