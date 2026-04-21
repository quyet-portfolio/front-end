import type { Metadata } from 'next'
import { TemplateGalleryView } from '@/src/app/section/PortfolioBuilder/TemplateGallery/TemplateGalleryView'

export const metadata: Metadata = {
  title: 'Portfolio Builder — Choose a Template',
  description: 'Build your personal portfolio with our drag-and-drop editor. Pick a template and start customizing.',
}

export default function PortfolioBuilderPage() {
  return <TemplateGalleryView />
}
