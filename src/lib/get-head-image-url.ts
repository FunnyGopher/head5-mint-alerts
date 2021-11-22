import phin from 'phin';

export default async function getHeadImageUrl(headId: string) {
  const response = await phin({
    url: `https://www.head5.io/api/metadata/${headId}`,
    method: 'GET',
    parse: 'json',
    followRedirects: true
  });

  const body = response.body as Head5MetadataResponse;
  return `https://ipfs.io/ipfs/${body.image.slice(7)}`;
}

type Head5MetadataResponse = {
  name: string,
  description: string,
  image: string,
  external_url: string,
  animation_url: string,
  background_color: string,
  attributes: Head5MetadataAttributes
}

type Head5MetadataAttribute = {
  trait_type: string
  value: string
}

type Head5MetadataAttributes = Head5MetadataAttribute[];