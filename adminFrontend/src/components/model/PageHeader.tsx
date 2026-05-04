type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};
 
const PageHeader = ({ title, subtitle, onBack }: Props) => (
  <div className="flex items-center gap-4 mb-8">
    <button
      onClick={onBack}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200
        bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300
        transition shadow-sm shrink-0"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div>
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);
 
export default PageHeader;
 