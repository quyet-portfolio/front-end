'use client'

import { Editor, Frame, Element } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { craftResolver, CraftContainer } from '@/src/craftjs-components'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'

interface PreviewLayoutProps {
  portfolioId: string
}

function patchCraftJsonParents(craftJson: Record<string, any>): Record<string, any> {
  const patched: Record<string, any> = JSON.parse(JSON.stringify(craftJson))
  for (const [nodeId, node] of Object.entries(patched)) {
    for (const childId of node.nodes ?? []) {
      if (patched[childId]) patched[childId].parent = nodeId
    }
    for (const childId of Object.values(node.linkedNodes ?? {})) {
      if (patched[childId as string]) patched[childId as string].parent = nodeId
    }
  }
  return patched
}

export const PreviewLayout = ({ portfolioId }: PreviewLayoutProps) => {
  const { fetchPortfolioById } = usePortfolioApi()
  const [craftJsonStr, setCraftJsonStr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolioById(portfolioId)
      .then((data) => {
        const patched = patchCraftJsonParents(data.portfolio.layout.craftJson)
        setCraftJsonStr(JSON.stringify(patched))
      })
      .catch(() => setError('Failed to load portfolio'))
      .finally(() => setLoading(false))
  }, [portfolioId, fetchPortfolioById])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !craftJsonStr) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-red-400">{error ?? 'Could not load portfolio'}</p>
      </div>
    )
  }

  return (
    <Editor resolver={craftResolver} enabled={false}>
      <Frame data={craftJsonStr}>
        <Element is={CraftContainer} canvas id="ROOT" />
      </Frame>
    </Editor>
  )
}
