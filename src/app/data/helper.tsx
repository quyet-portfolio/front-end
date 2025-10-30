import { FormOutlined, HomeOutlined, ProductOutlined } from '@ant-design/icons'

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
    title: 'Junior Front-End Developer with ReactJS',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2 min-h-30',
    imgClassName: 'w-full h-full',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },
  {
    id: 2,
    title: 'More than 1 year experience developing software on Shopify platform',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },
  {
    id: 4,
    title: 'To aim to become a full-stack developer.',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/grid.svg',
    spareImg: '/b4.svg',
  },

  {
    id: 5,
    title: 'Currently building apps on Shopify platform by Shopify Polaris library.',
    description: 'The Inside Scoop',
    className: 'md:col-span-3 md:row-span-2',
    imgClassName: 'absolute right-0 bottom-0 md:w-96 w-60',
    titleClassName: 'justify-start md:justify-start lg:justify-center',
    img: '',
    spareImg: '/grid.svg',
  },
  {
    id: 6,
    title: 'High sense of responsibility.',
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
    title: 'Omega Facebook Pixel Ad Report',
    des: 'Optimize ads & ROAS with Facebook Pixel, CAPI, manage product feeds & access key metrics in one app.',
    img: '/facebook-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg', 'antd.svg', '/ts.svg'],
    link: 'https://apps.shopify.com/facebook-multi-pixels',
  },
  {
    id: 2,
    title: 'TikShop: Feed & Omega Pixel',
    des: 'Master your TikTok Ad with ease - grab your trio of Pixel, Events API and Feed.',
    img: '/tiktok-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg', '/tail.svg', '/ts.svg'],
    link: 'https://apps.shopify.com/tiktok-multi-pixels',
  },
  {
    id: 3,
    title: 'Omega Twitter Pixel,Conversion',
    des: "Skyrocket your conversions with Multi Twitter Pixels' 5 powerful events & Conversion API.",
    img: '/twitter-pixel.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/redux.svg'],
    link: 'https://apps.shopify.com/twitter-multi-pixels',
  },
  {
    id: 4,
    title: 'Dingdoong: Delivery Date',
    des: 'Plan your delivery schedule ahead with date picker for shipping, local delivery and store pickup.',
    img: '/dingdoong.webp',
    iconLists: ['/laravel.svg', '/re.svg', '/tail.svg', '/ts.svg', '/dock.svg'],
    link: 'https://apps.shopify.com/delivery-date-omega',
  },
]

export const testimonials = [
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: 'Michael Johnson',
    title: 'Director of AlphaStream Technologies',
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: 'Michael Johnson',
    title: 'Director of AlphaStream Technologies',
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: 'Michael Johnson',
    title: 'Director of AlphaStream Technologies',
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: 'Michael Johnson',
    title: 'Director of AlphaStream Technologies',
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: 'Michael Johnson',
    title: 'Director of AlphaStream Technologies',
  },
]

export const companies = [
  {
    id: 1,
    name: 'cloudinary',
    img: '/cloud.svg',
    nameImg: '/cloudName.svg',
  },
  {
    id: 2,
    name: 'appwrite',
    img: '/app.svg',
    nameImg: '/appName.svg',
  },
  {
    id: 3,
    name: 'HOSTINGER',
    img: '/host.svg',
    nameImg: '/hostName.svg',
  },
  {
    id: 4,
    name: 'stream',
    img: '/s.svg',
    nameImg: '/streamName.svg',
  },
  {
    id: 5,
    name: 'docker.',
    img: '/dock.svg',
    nameImg: '/dockerName.svg',
  },
]

export const workExperience = [
  {
    id: 1,
    title: 'Frontend Developer',
    desc: 'Assisted in the development of a web-based platform using React.js.',
    className: 'md:col-span-2',
    thumbnail: '/exp1.svg',
  },
  {
    id: 2,
    title: 'Built for Shopify',
    desc: 'Design and develop applications to meet BFS standards (UX/UI innovation and LCP optimization).',
    className: 'md:col-span-2',
    thumbnail: '/bfs.webp',
  },
  {
    id: 3,
    title: 'SEO in Wordpress',
    desc: 'Optimize SEO quality for website built by Wordpress.',
    className: 'md:col-span-2',
    thumbnail: '/exp3.svg',
  },
  {
    id: 4,
    title: 'Scrum master',
    desc: 'Manage and guide team members to operate according to Scrum frame-word.',
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
