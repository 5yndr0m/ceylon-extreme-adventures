// upload-hero-media.ts
import {createClient} from '@sanity/client'
import fs from 'fs'
import 'dotenv/config'

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function run() {
  const poster = await sanity.assets.upload('image', fs.createReadStream('./hero-poster.jpg'), {
    filename: 'hero-poster.jpg',
    contentType: 'image/jpeg',
  })
  console.log('Poster:', poster.url)

  const video = await sanity.assets.upload('file', fs.createReadStream('./hero-video.webm'), {
    filename: 'hero-video.webm',
    contentType: 'video/webm',
  })
  console.log('Video: ', video.url)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
