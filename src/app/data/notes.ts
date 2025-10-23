export type Note = {
  id: number
  title: string
  content: string[]
}

export type Folder = {
  id: number
  title: string,
  qualityItems: number,
  category: string[],
  children: Note[],
  author?: any
}

export const dataNotes: Folder[] = [
  {
    id: 111,
    title: 'Daily words',
    qualityItems: 1,
    category: ['Vocabulary', 'New word'],
    children: [
      {
        id: 11,
        title: 'Hello',
        content: ['Xin chào'],
      },
    ],
  },
  {
    id: 111,
    title: 'Daily words',
    qualityItems: 1,
    category: ['Vocabulary', 'new word'],
    children: [
      {
        id: 11,
        title: 'Hello',
        content: ['Xin chào'],
      },
    ],
  },
  {
    id: 111,
    title: 'Daily words',
    qualityItems: 1,
    category: ['Vocabulary', 'new word'],
    children: [
      {
        id: 11,
        title: 'Hello',
        content: ['Xin chào'],
      },
    ],
  },
]
