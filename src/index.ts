import { GetRandomFoxImageData } from "./lib/fox";
import { BskyAgent, RichText } from "@atproto/api";

export interface Env {
    BSKY_PASSWORD: string;
}

async function doUpload(password: string) {
        let agent = new BskyAgent({service: "https://bsky.social"});
        await agent.login({
            identifier: "fox.pics",
            password: password,
        });
        console.log(agent.session);
        
        const did = agent.session?.did;
        if (!did) {
            throw new Error("No DID");
        }


        const data = await GetRandomFoxImageData();
        const foxUpload = await agent.uploadBlob(data.data, {encoding: data.contentType});
        const rt = new RichText({
            text: "Random image from https://fox.pics",
        });
        await rt.detectFacets(agent);

        await agent.app.bsky.feed.post.create(
            { repo: did },
            {
                text: rt.text,
                facets: rt.facets,
                embed: {
                    images: [
                        {
                            image: foxUpload.data.blob,
                            alt: "Fox",
                        }
                    ],
                    $type: "app.bsky.embed.images",
                },
                createdAt: new Date().toISOString(),
            },
        )
}

export default {
	async scheduled(
		_controller: ScheduledController,
		env: Env,
		_ctx: ExecutionContext
	): Promise<void> {
        await doUpload(env.BSKY_PASSWORD);
	},
};
