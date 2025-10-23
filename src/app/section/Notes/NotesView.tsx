import React from 'react'
import Spotlight from '../../components/Layout/ui/Spotlight'
import NotesHeading from './NotesHeading'
import { HomeOutlined, LoginOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import NotesList from './NotesList'

const NotesView = () => {
  return (
    <div className="relative bg-black-100 min-h-screen overflow-hidden mx-auto sm:px-10 px-5">
      <div className="absolute inset-0 overflow-hidden">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div className="relative w-full h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
        <NotesHeading />
        <NotesList />
      </div>
    </div>
  )
}

export default NotesView
