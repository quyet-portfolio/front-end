import React from 'react'
import { dataNotes } from '../../data/notes'

const NotesList = () => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 w-full">
      {dataNotes.map((item, index) => (
        <div key={index} className="p-4 rounded-md min-h-[200px] bg-[#0a0f24] hover:border-b-4 hover:border-b-black-200 flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium">{item.title}</p>
            <div>
              {item?.qualityItems} item{item?.qualityItems > 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              {item?.category[0]} <span className='rounded-[50%] p-1 bg-slate-700 text-xs'>{item?.category?.length > 1 ? `+${item.category.length - 1}` : ''}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesList
