import '@/styles/globals.css';
import type { Metadata } from 'next';
import EnvironmentStatus from '@/components/EnvironmentStatus';

export const metadata: Metadata = {
    title: 'Prompt Engine | Constructiv AI',
    description: 'AI prompt builder for construction industry professionals',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col min-h-screen">
                    {children}
                    <EnvironmentStatus />
                    <footer className="bg-white border-t border-gray-100 py-4">
                        <div className="container-fluid">
                            <p className="text-sm text-gray-500 text-center">
                                © {new Date().getFullYear()} Constructiv AI • Internal Tool
                            </p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
} 