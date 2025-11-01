import BlogCard from '@/components/BlogCard';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag } from 'lucide-react';
import blogData from '@/data/blog.json';
import productsData from '@/data/products.json';

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
          <h1 className="text-2xl font-bold mb-2">Conteúdo & Produtos</h1>
          <p className="text-white/90 text-sm">
            Dicas, artigos e produtos para potencializar sua jornada fitness
          </p>
        </motion.div>

        {/* Blog Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Artigos Recentes</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {blogData.posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Produtos em Destaque</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {productsData.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
