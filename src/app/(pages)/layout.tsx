import LayoutContent from '../_layout/LayoutContent'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutContent>{children}</LayoutContent>
}