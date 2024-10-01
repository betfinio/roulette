import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PageNavigationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
	return (
		<div className="w-full flex justify-between items-center mt-6 py-2 px-4 bg-[var(--bg-sec)] rounded-lg border-default border-[var(--border-primary)]">
			{/* Left Arrow */}
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => setCurrentPage(currentPage - 1)}
				disabled={currentPage === 1}
				className={`p-2 rounded-lg bg-[var(--bg-darker)] flex items-center justify-center text-white border-default border-[var(--border-primary)] ${
					currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				<FaArrowLeft />
			</button>

			{/* Dots representing pages */}
			<div className="flex space-x-2">
				{Array.from({ length: totalPages }, (_, i) => (
					<motion.div
						key={i}
						className={`h-2 w-2 rounded-full ${i + 1 === currentPage ? 'bg-[var(--yellow)]' : 'bg-gray-500'}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					/>
				))}
			</div>

			{/* Right Arrow */}
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => setCurrentPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`p-2 rounded-lg bg-[var(--bg-darker)] flex items-center justify-center text-white border-default border-[var(--border-primary)] ${
					currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				<FaArrowRight />
			</button>
		</div>
	);
};

export default PageNavigation;
