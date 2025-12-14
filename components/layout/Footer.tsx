import Link from 'next/link';

/**
 * Footer component - can be lazy loaded on pages
 * This component is loaded dynamically to improve initial page load
 */
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">EduLearn</h3>
                        <p className="text-sm">
                            Empowering learners worldwide with quality education.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-sm mb-2">Email: support@edulearn.com</p>
                        <p className="text-sm">Phone: +1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} EduLearn. All rights reserved.</p>
                    <p className="mt-2">
                        Made with ❤️ by{' '}
                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Your Name
                        </a>
                        {' | '}
                        <a
                            href="https://linkedin.com/in/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            LinkedIn
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
