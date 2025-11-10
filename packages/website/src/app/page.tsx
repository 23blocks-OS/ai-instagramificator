import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Your Talent Deserves the Spotlight
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
              Create professional portfolios that get you noticed by agencies and producers.
              Upload, edit, and showcase your best work in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full font-semibold text-lg border-2 border-purple-600 hover:shadow-xl transition-all duration-300"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to Shine
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📸"
              title="Upload & Organize"
              description="Drag and drop your photos and videos. Organize by projects, shoots, or categories with smart tagging."
            />
            <FeatureCard
              icon="✂️"
              title="Professional Editing"
              description="Crop, rotate, and apply filters. No need for expensive software - everything is built in."
            />
            <FeatureCard
              icon="🎨"
              title="Beautiful Templates"
              description="Choose from professionally designed templates for actors, models, dancers, and more."
            />
            <FeatureCard
              icon="🔗"
              title="Easy Sharing"
              description="Get a unique link to share with agencies. Embed your portfolio anywhere with one click."
            />
            <FeatureCard
              icon="🔒"
              title="Privacy Controls"
              description="Make portfolios public, private, or password-protected. You control who sees your work."
            />
            <FeatureCard
              icon="📱"
              title="Mobile Optimized"
              description="Your portfolio looks perfect on every device - desktop, tablet, or phone."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of aspiring talent who trust StarBook
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 StarBook. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}
