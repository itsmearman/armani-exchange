// pages/blog.tsx
import React from "react";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "بیت کوین چیست؟",
    excerpt: "کوتاه‌ترین تعریف بیت کوین.",
    date: "2024-04-25",
    imageUrl:
      "https://img.freepik.com/free-photo/still-life-arrangement-with-cryptocurrency_23-2149102138.jpg?ga=GA1.1.822584843.1746348651&semt=ais_hybrid&w=740", // در صورت نیاز تصویر اضافه کنید
  },
  {
    id: 2,
    title: "همه چیز درباره ریپل",
    excerpt: "از ورشکستگی تا محبوبیت.",
    date: "2024-04-20",
    imageUrl:
      "https://img.freepik.com/premium-photo/3d-illustration-digital-cryptocurrency-ripple_273081-482.jpg?ga=GA1.1.822584843.1746348651&semt=ais_hybrid&w=740",
  },
  {
    id: 3,
    title: "استخراج بیت کوین",
    excerpt: "آیا دوره استخراج ارزهای دیجیتال تمام شده؟.",
    date: "2024-04-15",
    imageUrl:
      "https://img.freepik.com/premium-photo/golden-bitcoin-computer-chip_127657-16082.jpg?ga=GA1.1.822584843.1746348651&semt=ais_hybrid&w=740",
  },
];

const BlogPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-[7rem] py-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        وبلاگ ما
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg shadow-lg shadow-gray-500 overflow-hidden hover:shadow-xl transition-shadow duration-300 "
          >
            {post.imageUrl && (
              <img
                src={post?.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 dark:text-white">{post.excerpt}</p>
              <p className="text-sm text-gray-500 dark:text-white">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
