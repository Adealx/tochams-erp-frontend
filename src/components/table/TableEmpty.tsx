import { Inbox } from "lucide-react";

export default function TableEmpty() {

    return (

        <div
            className="
            py-20
            text-center
            "
        >

            <Inbox
                size={60}
                className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-semibold">

                No Data Available

            </h2>

            <p className="text-slate-500">

                Records will appear here.

            </p>

        </div>

    );

}