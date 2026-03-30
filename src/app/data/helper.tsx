import { FormOutlined, HomeOutlined, ProductOutlined, FireOutlined } from '@ant-design/icons'

export const navItems = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/#about' },
  { name: 'Projects', link: '/#projects' },
  { name: 'Experience', link: '/#experience' },
  { name: 'Contact', link: '/#contact' },
]

export const menuItems = [
  {
    name: 'Home',
    link: '/',
    icon: <HomeOutlined />,
  },
  { name: 'Blogs', link: '/blogs', icon: <ProductOutlined /> },
  { name: 'Notes', link: '/notes', icon: <FormOutlined /> },
  { name: 'What To Eat', link: '/what-to-eat', icon: <FireOutlined /> },
]

export const gridItems = [
  {
    id: 3,
    title: 'My tech stack',
    description: 'I constantly try to improve',
    className: 'lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[30vh] min-h-[165px]',
    imgClassName: '',
    titleClassName: 'justify-center',
    img: '',
    spareImg: '/grid.svg',
  },
  {
    id: 1,
    title: 'Front-end Developer at Sky Corporation',
    description: 'Specializing in building high-performance SaaS Platforms and modern CMS solutions.',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2 min-h-30',
    imgClassName: 'w-full h-full',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },
  {
    id: 2,
    title: 'Over 2 years of expertise in Shopify App development',
    description: 'Building merchant-facing applications that meet Built for Shopify standards.',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },
  {
    id: 4,
    title: 'Airing towards Full-stack proficiency',
    description: 'Expanding expertise in Node.js, Express, and MongoDB for comprehensive product development.',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },

  {
    id: 5,
    title: 'Building scalable SaaS modules with TypeScript & Tailwind CSS.',
    description: 'The Inside Scoop',
    className: 'md:col-span-3 md:row-span-2',
    imgClassName: 'absolute right-0 bottom-0 md:w-96 w-60',
    titleClassName: 'justify-start md:justify-start lg:justify-center',
    img: '',
    spareImg: '/grid.svg',
  },
  {
    id: 6,
    title: 'Focus on Performace, Core Web Vitals, and SEO Optimization.',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-center md:justify-start lg:justify-center',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },
]

export const projects = [
  {
    id: 1,
    title: 'BettaMax: E-commerce SaaS',
    des: 'A comprehensive SaaS Platform for merchants with RBAC security, performance analytics, and store operations.',
    img: '/betta-max.webp',
    iconLists: ['/next.svg', '/ts.svg', '/tail.svg', 'antd.svg', '/re.svg'],
    link: 'https://admin.bettamax.com',
  },
  {
    id: 2,
    title: 'Sky Solution Website',
    des: 'A business website with integrated Admin CMS. High-performance SSR with Payload CMS and optimized SEO.',
    img: '/sky-solution.webp',
    iconLists: ['/next.svg', '/tail.svg', 'antd.svg', '/ps.svg'],
    link: 'https://skysolution.com/',
  },
  {
    id: 3,
    title: 'Omega Facebook Pixel Ad Report',
    des: 'Optimize ads & ROAS with Facebook Pixel, CAPI, manage product feeds & access key metrics in one app.',
    img: '/facebook-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg', 'antd.svg', '/ts.svg'],
    link: 'https://apps.shopify.com/facebook-multi-pixels',
  },
  {
    id: 4,
    title: 'TikShop: Feed & Omega Pixel',
    des: 'Master your TikTok Ad with ease - grab your trio of Pixel, Events API and Feed.',
    img: '/tiktok-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg', '/tail.svg', '/ts.svg'],
    link: 'https://apps.shopify.com/tiktok-multi-pixels',
  },
  {
    id: 5,
    title: 'Omega Twitter Pixel,Conversion',
    des: "Skyrocket your conversions with Multi Twitter Pixels' 5 powerful events & Conversion API.",
    img: '/twitter-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg'],
    link: 'https://apps.shopify.com/twitter-multi-pixels',
  },
  {
    id: 6,
    title: 'Dingdoong: Delivery Date',
    des: 'Plan your delivery schedule ahead with date picker for shipping, local delivery and store pickup.',
    img: '/dingdoong.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/tail.svg', '/ts.svg', '/dock.svg'],
    link: 'https://apps.shopify.com/delivery-date-omega',
  },
]

export const workExperience = [
  {
    id: 1,
    title: 'SaaS Platform Development',
    desc: 'Led the frontend architecture for BettaMax, a complex E-commerce SaaS. Implemented RBAC, scalable state management, and real-time performance tracking.',
    className: 'md:col-span-2',
    thumbnail: '/exp1.svg',
  },
  {
    id: 2,
    title: 'Shopify Ecosystem Expertise',
    desc: 'Architected high-conversion Shopify Apps following "Built for Shopify" standards. Optimized LCP and refined UX/UI for merchant-facing dashboards.',
    className: 'md:col-span-2',
    thumbnail: '/bfs.webp',
  },
  {
    id: 3,
    title: 'Headless CMS & SSR Architecture',
    desc: 'Developed blazingly fast websites using Next.js and Payload CMS. Focused on Server-Side Rendering (SSR) and seamless content management workflows.',
    className: 'md:col-span-2',
    thumbnail: '/exp3.svg',
  },
  {
    id: 4,
    title: 'Technical SEO & Performance',
    desc: 'Specialized in technical SEO optimization, implementing semantic HTML, Schema markup, and Core Web Vitals improvements for maximum search visibility.',
    className: 'md:col-span-2',
    thumbnail: '/exp2.svg',
  },
]

export const socialMedia = [
  {
    id: 1,
    img: '/git.svg',
    link: 'https://github.com/buiduyquyet',
  },
  {
    id: 2,
    img: '/facebook.svg',
    link: 'https://www.facebook.com/quyetdaica.09/',
  },
  {
    id: 3,
    img: '/link.svg',
    link: 'https://www.linkedin.com/in/dev-bui-duy-quyet/',
  },
]
