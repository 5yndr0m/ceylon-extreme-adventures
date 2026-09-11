import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ceylon Extreme Adventures',
    short_name: 'CEA',
    description: 'Chase Freedom, One Adventure at a Time',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#14181A',
    icons: [
      {src: '/icon.png', sizes: '512x512', type: 'image/png'},
      {src: '/apple-icon.png', sizes: '180x180', type: 'image/png'},
    ],
  }
}
