interface TabsProps {
  readonly activeTab: number;
  readonly tabs: string[];
  readonly onTabChange?: (tabIndex: number) => void;
}

export default function Tabs({ activeTab, tabs, onTabChange }: TabsProps) {
  return (
    <div className="flex space-x-4">
      {tabs.map((tab, index: number) => (
        <button
          key={index + tab}
          className={`px-4 py-2 rounded text-chocolate-950 ${
            activeTab === index ? "bg-matcha-lighter" : ""
          }`}
          onClick={() => {
            onTabChange?.(index);
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
