import { Github, Linkedin } from 'lucide-react';

/**
 * Simple compact footer with developer credits
 */
export default function SimpleFooter() {
    return (
        <footer className="bg-gray-100 border-t py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
                    <span>© {new Date().getFullYear()} EduLearn</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                        Built by{' '}
                        <a
                            href="https://github.com/abhishek9640"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                        >
                            Abhishek Kumar
                        </a>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/abhishek9640"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="GitHub Profile"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/abhishek-54-kr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            aria-label="LinkedIn Profile"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
