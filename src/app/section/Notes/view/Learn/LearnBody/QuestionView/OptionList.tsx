import React from 'react'

const OptionList = ({
    options,
    onSelect
} : {
    options: string[] | undefined
    onSelect: (answer: string) => Promise<void>
}) => {
  return (
    <div>OptionList</div>
  )
}

export default OptionList