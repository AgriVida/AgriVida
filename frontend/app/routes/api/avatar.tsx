import {
    fileStorage,
    getAvatarStorageKey,
} from "../../utils/image-storage.server";
import type { Route } from "./+types/avatar";

export async function loader({ params }: Route.LoaderArgs) {
    const storageKey = getAvatarStorageKey(params.userId);
    const file = await fileStorage.get(storageKey);

    if (!file) {
        throw new Response("Avatar not found", {
            status: 404,
        });
    }

    return new Response(file.stream(), {
        headers: {
            "Content-Type": file.type,
            "Cache-Control": "no-cache",
        },
    });
}
