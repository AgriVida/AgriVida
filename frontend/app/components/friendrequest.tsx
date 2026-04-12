import { Form } from "react-router";

export function FriendRequestCard(props: { friend: { image: string, name: string }, requestorId: string }) {
    return (
        <div className="flex flex-col items-center">
            <img
                className="w-24 h-24 rounded-full object-cover mb-2"
                src={props.friend.image}
                alt={props.friend.name}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/image400.png" }}
            />
            <p className="p-4 font-bold text-xl text-center">{props.friend.name}</p>
            <div className="flex justify-center w-full gap-4">
                <Form method="post">
                    <input type="hidden" name="intent" value="acceptFriend" />
                    <input type="hidden" name="requestorId" value={props.requestorId} />
                    <button
                        type="submit"
                        className="mt-6 text-white bg-green-600 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Confirm
                    </button>
                </Form>
                <Form method="post">
                    <input type="hidden" name="intent" value="declineFriend" />
                    <input type="hidden" name="requestorId" value={props.requestorId} />
                    <button
                        type="submit"
                        className="mt-6 text-white bg-red-600 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Decline
                    </button>
                </Form>
            </div>
        </div>
    )
}
