import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps {
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const Select: React.FC<SelectProps> = ({ onValueChange, value, defaultValue, disabled, children }) => {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || '');
  const [open, setOpen] = React.useState(false);
  
  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  const contextValue = {
    value: value !== undefined ? value : internalValue,
    onValueChange: handleValueChange,
    open,
    setOpen: disabled ? () => {} : setOpen
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        onClick={() => context?.setOpen(!context.open)}
        {...props}
      >
        {children}
        <div className="h-4 w-4 opacity-50">▼</div>
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  const displayValue = context?.value || placeholder || "Select option...";
  
  return <span className={!context?.value ? "text-gray-500" : ""}>{displayValue}</span>;
};

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const context = React.useContext(SelectContext);
  
  if (!context?.open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;
  
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm hover:bg-gray-100",
        isSelected && "bg-blue-50 text-blue-700",
        className
      )}
      onClick={() => context?.onValueChange(value)}
    >
      {isSelected && <span className="mr-2">✓</span>}
      {children}
    </div>
  );
};

// Simple aliases for compatibility
const SelectGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("py-1.5 px-3 text-sm font-semibold text-gray-700", className)}>{children}</div>
);
const SelectSeparator = ({ className }: { className?: string }) => (
  <div className={cn("my-1 h-px bg-gray-200", className)} />
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};