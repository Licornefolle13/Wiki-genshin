import { Search } from 'lucide-react';

interface Props {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    return (
        <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-md px-3 py-2 w-full">
                <Search className="text-slate-400" size={18} />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || 'Search...'}
                    className="ml-2 w-full bg-transparent text-slate-200 placeholder:text-slate-400 outline-none"
                />
            </div>
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
