export async function GetRandomFoxURLs(): Promise<string[]> {
    const response = await fetch('https://api.fox.pics/v1/get-random-foxes');
    const data = await response.json() as string[];
    return data;
}

export async function FindImageURL(): Promise<string> {
    const maxIterations = 10;
    for (let i = 0; i < maxIterations; i++) {
        const urls = await GetRandomFoxURLs();
        for (let j = 0; j < urls.length; j++) {
            if (urls[j].endsWith(".jpg") || urls[j].endsWith(".png")) {
                return urls[j];
            }
        }
    }

    return "";
}

export async function GetRandomFoxImageData(): Promise<{data: Uint8Array, contentType: string}> {
    let url = await FindImageURL();

    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "";
    return {data: new Uint8Array(data), contentType};
}
