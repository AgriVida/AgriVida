

import { Link } from "react-router";

export function FriendCard(props: { friend: { image: string, name: string }, id: string }) {
    return (
        <Link to={`/friendprofile/${props.id}`} className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <img
                className="w-24 h-24 rounded-full object-cover mb-2"
                src={props.friend.image}
                alt={props.friend.name}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/image400.png" }}
            />
            <p className="p-4 font-bold text-xl text-center">{props.friend.name}</p>
        </Link>
    )
}
