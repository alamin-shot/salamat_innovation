"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-white px-4 py-3 text-[12px] text-gray-600 sm:px-6">
            <div>
                Showing 1 to 10 of 352 entries
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                    <span>Show per page:</span>
                    <select className="rounded border border-gray-200 py-1 px-2 focus:outline-none focus:border-emerald-500 bg-white">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 hidden md:flex">
                    <span>Go to page:</span>
                    <input type="number" className="w-12 rounded border border-gray-200 py-1 px-2 focus:outline-none focus:border-emerald-500" />
                </div>

                <div className="flex items-center rounded border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <button className="px-2 py-1 hover:bg-gray-50 border-r border-gray-200 disabled:opacity-50 text-gray-400">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 bg-emerald-600 text-white font-medium text-[13px]">1</button>
                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200">2</button>
                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200 hidden sm:block">3</button>
                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200 hidden sm:block">4</button>
                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200 hidden sm:block">5</button>
                    <span className="px-2 py-1 text-gray-400 border-l border-gray-200">...</span>
                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200 hidden sm:block">36</button>
                    <button className="px-2 py-1 hover:bg-gray-50 border-l border-gray-200 text-gray-600">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}