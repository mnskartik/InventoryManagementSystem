export const Table = ({ children }) => <table className="w-full text-sm">{children}</table>;
export const TableHeader = ({ children }) => <thead className="bg-gray-100">{children}</thead>;
export const TableBody = ({ children }) => <tbody className="divide-y">{children}</tbody>;
export const TableRow = ({ children }) => <tr>{children}</tr>;
export const TableHead = ({ children }) => (
  <th className="text-left px-4 py-2 font-medium">{children}</th>
);
export const TableCell = ({ children }) => <td className="px-4 py-2">{children}</td>;
