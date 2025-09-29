export interface Blog {
    id: number;
    category?: string;
    title: string;
    description: string;
    image: string;
    background: string;
    createAt: string;
    updateAt: string;
    author: string;
}

export const dataBlogs: Blog[] = [
    {
        id: 1,
        category: "Programming",
        title: "Understanding TypeScript",
        description: "A comprehensive guide to TypeScript for JavaScript developers.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#f5f5f5",
        createAt: "2024-06-01T10:00:00Z",
        updateAt: "2024-06-02T12:00:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 2,
        category: "Programming",
        title: "React Hooks in Depth",
        description: "Explore the power of React Hooks and how to use them effectively.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#e0f7fa",
        createAt: "2024-06-03T09:30:00Z",
        updateAt: "2024-06-03T11:00:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 3,
        category: "Programming",
        title: "Building REST APIs with Node.js",
        description: "Step-by-step tutorial on creating RESTful APIs using Node.js and Express.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#fff3e0",
        createAt: "2024-06-04T14:00:00Z",
        updateAt: "2024-06-04T16:00:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 4,
        category: "Programming",
        title: "Mastering CSS Grid",
        description: "Learn how to create complex layouts easily with CSS Grid.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#fce4ec",
        createAt: "2024-06-05T08:00:00Z",
        updateAt: "2024-06-05T09:30:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 5,
        category: "Programming",
        title: "Deploying Apps with Docker",
        description: "A beginner's guide to containerizing and deploying applications using Docker.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#e8f5e9",
        createAt: "2024-06-06T13:00:00Z",
        updateAt: "2024-06-06T15:00:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 6,
        category: "Programming",
        title: "Next.js for Production",
        description: "Best practices for building and deploying Next.js applications.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#ede7f6",
        createAt: "2024-06-07T11:00:00Z",
        updateAt: "2024-06-07T12:30:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 7,
        category: "Programming",
        title: "State Management with Redux",
        description: "How to manage complex state in React apps using Redux.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#fffde7",
        createAt: "2024-06-08T10:30:00Z",
        updateAt: "2024-06-08T12:00:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 8,
        category: "Programming",
        title: "Authentication in Web Apps",
        description: "Implementing secure authentication in modern web applications.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#e1f5fe",
        createAt: "2024-06-09T09:00:00Z",
        updateAt: "2024-06-09T10:30:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 9,
        category: "Programming",
        title: "Performance Optimization Tips",
        description: "Techniques to improve the performance of your web applications.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#f9fbe7",
        createAt: "2024-06-10T15:00:00Z",
        updateAt: "2024-06-10T16:30:00Z",
        author: "Quyet Nguyen"
    },
    {
        id: 10,
        category: "Programming",
        title: "GraphQL vs REST",
        description: "Comparing GraphQL and REST for API development.",
        image: "/images/next-js-a-react-js-framework.jpg",
        background: "#f3e5f5",
        createAt: "2024-06-11T08:30:00Z",
        updateAt: "2024-06-11T09:45:00Z",
        author: "Quyet Nguyen"
    }
];