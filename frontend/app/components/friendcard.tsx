

export function FriendCard(props: {friend: { image: string, name: string}}) {
    return (
        <>

            <div className="md:mx-0 mx-16 flex flex-col">
                <div className="md:mx-0 mx-16">
                    <img className="mb-2" src={props.friend.image} alt={props.friend.name}/>
                </div>
                <p className="p-4 font-bold text-3xl text-center flex-grow">{props.friend.name}</p>

            </div>

        </>
    )
}
