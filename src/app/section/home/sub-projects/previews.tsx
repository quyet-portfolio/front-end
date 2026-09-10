import { cn } from '@/src/lib/utils'

// Preview là giao diện của từng sub-project vẽ lại ở dạng thu nhỏ, dùng chung cho
// popover (desktop) và thẻ (mobile). Nội dung tĩnh, chỉ để minh hoạ — tên, mô tả và
// link đã có ở phần tử cha, nên toàn bộ preview ẩn khỏi cây accessibility.

// Nền lưới đứng thay cho ảnh bìa bài viết.
const GRID_PLACEHOLDER =
  'bg-[#10132E] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:12px_12px]'

const SAMPLE_POSTS = [
  { category: 'Programming', title: 'SEO cho blog Next.js: 9 bài học sau ba tuần sửa lại' },
  { category: 'Psychology', title: 'Có người nói chẳng cần đến tình yêu, cho đến khi họ có một điều gì đó muốn kể.' },
]

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
        <div key={post.title} className="overflow-hidden rounded-[10px] border border-white/[0.06] bg-white/[0.03]">
          <div className={cn('relative h-[84px]', GRID_PLACEHOLDER)}>
            <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-bold uppercase leading-none text-white">
              {post.category}
            </span>
          </div>
          <div className="px-2 pb-2.5 pt-1.5">
            <p className="line-clamp-2 text-[10px] font-bold leading-[14px] text-white">{post.title}</p>
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
