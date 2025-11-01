import BlogCard from '@/components/BlogCard';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import blogData from '@/data/blog.json';

export default function Blog() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-2xl p-6 text-white card-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Blog FitLife</h1>
              <p className="text-white/90 text-sm">
                Dicas e artigos para potencializar sua jornada fitness
              </p>
            </div>
          </div>
        </motion.div>

        {/* Blog Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Artigos Recentes</h2>
            <span className="text-sm text-muted-foreground">{blogData.posts.length} artigos</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {blogData.posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
