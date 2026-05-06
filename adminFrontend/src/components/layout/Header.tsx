type Props = {
  activeModel: string;
};
 
const Header = ({ activeModel }: Props) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Admin</span>
      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="font-semibold text-gray-900 capitalize">{activeModel}</span>
    </div>
  </header>
);
 
export default Header;