import { HabiticaContent } from "../types/habitica-content";

export async function fetchHabiticaContent(): Promise<HabiticaContent> {
    const X_CLIENT = "habitica-avatar-manifest/1.0.0";
    const response = await fetch(`https://habitica.com/api/v3/content`, {
        headers: {
            "x-client": X_CLIENT,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching Habitica avatar: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
}