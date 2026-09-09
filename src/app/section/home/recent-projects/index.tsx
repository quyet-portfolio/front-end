import { FaLocationArrow } from 'react-icons/fa6'
import Image from 'next/image'
import { projects } from '@/src/app/data/helper'

const RecentProjects = () => {
  return (
    <section id="projects" className="scroll-mt-24">
      <div className="py-10 lg:py-20">
        <h2 className="heading">
          <span className="text-purple">Recent Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {projects.map((item) => (
            // Cả thẻ là một <a> thật: mở tab mới / copy link / focus bàn phím đều chạy,
            // và crawler nhìn thấy liên kết ra sản phẩm.
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col w-full p-4 rounded-2xl border border-white/[0.1] hover:border-white/[0.3] transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100"
            >
              <div className="overflow-hidden mb-6 rounded-lg">
                <Image
                  src={item.img}
                  alt={`Ảnh chụp dự án ${item.title}`}
                  className="w-full h-full group-hover:scale-105 transition duration-500 object-cover"
                  width={400}
                  height={300}
                />
              </div>
              <h3 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-2">{item.title}</h3>
              <p className="lg:text-xl lg:font-normal font-light text-sm text-[#BEC1DD] my-[1vh]">{item.des}</p>

              <div className="flex items-center justify-between mt-auto pt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      aria-hidden
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <Image src={icon} alt="" className="p-2" width={40} height={40} />
                    </div>
                  ))}
                </div>

                {/* Chỉ là phần nhìn: cả card đã là link nên không lồng thêm anchor. */}
                <span className="flex justify-center items-center p-2 rounded-full group-hover:bg-purple/20 transition duration-500">
                  <span className="flex lg:text-xl md:text-sm text-sm text-purple">Check Live Site</span>
                  <FaLocationArrow className="ms-3" color="#CBACF9" aria-hidden />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentProjects
