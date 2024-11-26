import { cn } from '@betfinio/components';
import { Button } from '@betfinio/components/ui';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
interface PageNavigationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
	return (
		<div className="w-full flex justify-between items-center mt-6 py-2 px-4 bg-card border rounded-lg border-border">
			<Button variant="tertiary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
				<FaArrowLeft />
			</Button>

			{/* Dots representing pages */}
			<div className="flex space-x-2">
				{Array.from({ length: totalPages }, (_, i) => (
					<motion.div
						key={i}
						className={cn('h-2 w-2 rounded-full', {
							'bg-secondary-foreground': i + 1 === currentPage,
							'bg-tertiary-foreground': i + 1 !== currentPage,
						})}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					/>
				))}
			</div>

			<Button variant="tertiary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
				<FaArrowRight />
			</Button>
		</div>
	);
};

export default PageNavigation;
