"use client";

import { Search } from "lucide-react";

export default function TableToolbar() {

    return (

        <div
            className="
            flex
            items-center
            justify-between
            mb-5
            "
        >

            <div className="relative">

                <Search
                    className="absolute left-3 top-3"
                    size={18}
                />

                <input
                    placeholder="Search..."
                    className="
                    w-80
                    rounded-xl
                    border
                    py-2.5
                    pl-10
                    "
                />

            </div>

        </div>

    );

}