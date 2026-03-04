interface TabNavigationProps {
  activeTab: "rst" | "finished";
  setActiveTab: (tab: "rst" | "finished") => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="border-b border-border">
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab("rst")}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "rst"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Raw Sawn Timber (RST)
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "finished"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Finished Product
        </button>
      </div>
    </div>
  );
}
