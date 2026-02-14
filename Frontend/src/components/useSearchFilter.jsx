import React from "react";
import { Search, ArrowUpDown, ListChecks } from "lucide-react";

function UseSearchFilter({ value, onChange, total = 0 }) {
   
  return (
    <div className="space-y-4">
      {/* Top Info Row */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-blue-400" />
          <span>
            Total Results:{" "}
            <span className="text-slate-200 font-medium">{total}</span>
          </span>
        </div>

        <div className="hidden sm:block">
          <span className="text-xs tracking-wide">
            Refine results using search, sort, or filters
          </span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            onChange={(e)=>onChange({...value, search:e.target.value})}
            type="text"
            placeholder="Search "
            value={value.search}
            className="
              w-full pl-9 pr-3 py-2.5 text-sm rounded-lg
              bg-white/5 text-white placeholder-white/30
              border border-brand/30
              focus:bg-white/8 focus:border-brand focus:outline-none
              transition-all duration-300
            "
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
          onChange={(e)=>onChange({...value, sortBy:e.target.value})}
            value={value.sortBy}
            className="
              pl-9 pr-8 py-2.5 text-sm rounded-lg
              bg-white/5 text-white
              border border-brand/30
              focus:bg-white/8 focus:border-brand focus:outline-none
              transition-all duration-300
            "
          >
            <option value="" disabled>
              Sort by
            </option>
            <option value="time" className="bg-panel">
              Sort by time
            </option>
            <option value="name" className="bg-panel">
              Sort by name
            </option>
          </select>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(127,164,196,0.12)]" />
    </div>
  );
}

export default UseSearchFilter;
