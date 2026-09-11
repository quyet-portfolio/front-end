import Image from 'next/image'
import { cn } from '@/src/lib/utils'

const GRID_PLACEHOLDER =
  'bg-[#10132E] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:12px_12px]'

const SAMPLE_POSTS = [{ category: 'Programming' }, { category: 'Psychology' }]

const BUILDER_BLOCKS = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact']

export const BlogsPreview = () => (
  <div aria-hidden className="flex h-full flex-col gap-3 p-3.5">
    <div className="flex gap-1.5">
      {['All', ...SAMPLE_POSTS.map((post) => post.category)].map((category, idx) => (
        <span
          key={category}
          className={cn(
            'rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-3',
            idx === 0 ? 'border-primary bg-primary text-white' : 'border-blue-950 text-white-100',
          )}
        >
          {category}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2.5">
      {SAMPLE_POSTS.map((post) => (
        <div key={post.category} className="overflow-hidden rounded-[10px] border border-white/[0.06] bg-white/[0.03]">
          <div className={cn('relative h-[84px]', GRID_PLACEHOLDER)}>
            <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-bold uppercase leading-none text-white">
              {post.category}
            </span>
          </div>
          <div className="px-2 pb-2.5 pt-1.5">
            <div className="flex flex-col gap-1.5">
              <div className="h-[10px] rounded bg-white/[0.06]" />
              <div className="h-[10px] w-[50%] rounded bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const NotesPreview = () => (
  <div aria-hidden className="flex h-full items-center justify-center">
    <div className="relative h-[166px] w-[230px]">
      <div className="absolute inset-x-3 top-3.5 h-[152px] rounded-2xl border border-white/[0.06] bg-card opacity-50" />
      <div className="absolute inset-x-0 top-0 flex h-[152px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900 px-5 shadow-xl shadow-black/40">
        <span className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Term</span>
        <span className="text-center text-[26px] font-bold leading-8 text-white">Within</span>
      </div>
    </div>
  </div>
)

const NAMDINH_LOGO = '/projects/namdinhfc-logo.webp'

const NAMDINH_SECTIONS = ['Squad', 'Fixtures', 'Standings']

export const NamDinhFcPreview = () => (
  <div aria-hidden className="flex h-full p-3">
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B0E24]">
      <div className="flex h-[22px] shrink-0 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-2">
        <div className="flex gap-[3px]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[5px] rounded-full bg-white/20" />
          ))}
        </div>
        <div className="flex h-3 min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap rounded-full bg-white/[0.05] px-1.5 text-[7px] leading-none text-white-100">
          <svg
            width="6"
            height="6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="shrink-0"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          namdinhfc.vercel.app
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Image src={NAMDINH_LOGO} alt="" width={12} height={12} className="size-3" />
            <span className="h-1.5 w-[34px] rounded-full bg-white/[0.18]" />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((bar) => (
              <span key={bar} className="h-1 w-3.5 rounded-full bg-white/10" />
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-md bg-[linear-gradient(135deg,rgba(99,102,241,0.38)_0%,rgba(203,172,249,0.12)_55%,rgba(16,19,46,0.4)_100%)] p-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
            <span className="self-start rounded-full bg-purple/15 px-[5px] py-0.5 text-[6px] font-bold leading-[7px] tracking-[0.08em] text-purple">
              V.LEAGUE
            </span>
            <span className="h-[7px] w-[85%] rounded-full bg-white/55" />
            <span className="h-[7px] w-[55%] rounded-full bg-white/55" />
            <div className="mt-[3px] flex gap-[5px]">
              <span className="h-2.5 w-8 rounded-full bg-primary" />
              <span className="h-2.5 w-8 rounded-full border border-white/30" />
            </div>
          </div>
          <Image
            src={NAMDINH_LOGO}
            alt=""
            width={64}
            height={64}
            className="size-16 shrink-0 drop-shadow-[0_6px_14px_rgba(59,130,246,0.35)]"
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {NAMDINH_SECTIONS.map((section) => (
            <div key={section} className="flex flex-col overflow-hidden rounded-[5px] border border-white/[0.06]">
              <div className={cn('h-[22px]', GRID_PLACEHOLDER)} />
              <span className="bg-white/[0.03] px-1.5 py-[3px] text-[7px] font-semibold leading-[8px] text-white-100">
                {section}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const BuilderPreview = () => (
  <div aria-hidden className="flex h-full">
    <div className="flex w-[88px] shrink-0 flex-col gap-1.5 border-r border-white/[0.06] bg-white/[0.02] px-2 py-2.5">
      <p className="pb-0.5 text-[8px] font-bold uppercase tracking-widest text-gray-500">Blocks</p>
      {BUILDER_BLOCKS.map((block, idx) => (
        <div
          key={block}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] leading-3',
            idx === 0 ? 'bg-primary/15 text-white' : 'text-white-100',
          )}
        >
          <span className={cn('size-[7px] rounded-[2px] border', idx === 0 ? 'border-primary' : 'border-white/30')} />
          {block}
        </div>
      ))}
    </div>

    <div className="min-w-0 flex-1 p-3">
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-md border border-white/[0.06] bg-slate-900 p-2.5">
        <div className="relative flex flex-col items-center gap-1.5 rounded border-[1.5px] border-primary px-2 pb-2.5 pt-3">
          <span className="absolute -top-2 left-1.5 rounded-sm bg-primary px-1 py-0.5 text-[8px] font-bold leading-none text-white">
            Hero
          </span>
          <div className="size-4 rounded-full bg-primary/35" />
          <div className="h-[5px] w-[70%] rounded-full bg-white/70" />
          <div className="h-2 w-[30px] rounded-full bg-primary" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-[30px] rounded bg-white/[0.06]" />
          <div className="h-[30px] rounded bg-white/[0.06]" />
        </div>
        <div className="h-1 rounded-sm bg-white/[0.08]">
          <div className="h-1 w-[85%] rounded-sm bg-primary" />
        </div>
        <div className="h-[26px] rounded bg-white/[0.06]" />
      </div>
    </div>
  </div>
)
