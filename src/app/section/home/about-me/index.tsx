import React from 'react'
import LayoutGrid, { LayoutGridItem } from '@/src/components/ui/LayoutGrid'
import { gridItems } from '@/src/app/data/helper'


const AboutMe = () => {
  return (
    <section id="about">
      <LayoutGrid className="w-full py-10 lg:py-20">
        {gridItems.map((item, i) => (
          <LayoutGridItem
            id={item.id}
            key={i}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </LayoutGrid>
    </section>
  )
}

export default AboutMe
