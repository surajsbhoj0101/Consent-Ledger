import React, { useState } from "react";
import { Search, ArrowUpDown, ListChecks } from "lucide-react";

function UseSearchFilter({value, onChange}) {
   
  return (
    <div className="space-y-4">
      {/* Top Info Row */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-blue-400" />
          <span>
            Total Results:{" "}
            <span className="text-slate-200 font-medium">128</span>
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
              bg-[rgba(15,23,42,0.6)] text-white
              border border-[rgba(127,164,196,0.15)]
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition
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
              bg-[rgba(15,23,42,0.6)] text-slate-200
              border border-[rgba(127,164,196,0.15)]
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition
            "
          >
            <option>Sort by time</option>
            <option>Sort by name</option>
          </select>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(127,164,196,0.12)]" />
    </div>
  );
}

export default UseSearchFilter;
