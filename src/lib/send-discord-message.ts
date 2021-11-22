import type { Head5Mint } from './types';
import getHeadImageUrl from './get-head-image-url';
import { wait } from './util';

import phin from 'phin';

export default async function sendDiscordMessage(mint: Head5Mint, webhookUrl: string) {
  for(const headId of mint.headIds) {
    let renderUrl;
    try {
      renderUrl = await getHeadImageUrl(headId);
    } catch(err) {
      console.error('Could not get head image url.', err);
      continue;
    }
    const message = createMessage(mint.address, headId, renderUrl);

    const response = await phin({
      url: webhookUrl,
      parse: 'json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(message)
    });

    const body = response.body as DiscordResponse;
    if(response.statusCode !== 204) {
      console.error('Could not send discord message.', { statusCode: body.statusCode, statusMessage: body.statusMessage });
    } else {
      console.log('Successfully sent Discord message.', { headId })
    }

    await wait(500);
  }
}

function createMessage(address: string, headId: string, imageUrl: string) {
  return {
    description: `Minted by ${address}`,
    embeds: [{
      title: `Head5 #${headId}`,
      image: imageUrl ? {
        url: imageUrl
      } : undefined,
      footer: {
        text: `Minted by ${address}`
      }
    }],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'OpenSea.io',
            url: `https://opensea.io/assets/matic/0x89d2e41408eacbbcc5eebeffaaa27fd2a01ff88b/${headId}`
          },
          {
            type: 2,
            style: 5,
            label: 'Head5.io',
            url: `https://head5.io/api/metadata/${headId}`
          }
        ]
      }
    ]
  };
}

type DiscordResponse = {
  statusCode: number
  statusMessage: string
  body: any
}