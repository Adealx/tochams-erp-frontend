import { Clock } from "lucide-react";

interface Props{

    title:string;

    description:string;

    time:string;

}

export default function ActivityCard({

    title,

    description,

    time,

}:Props){

    return(

        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">

            <div className="rounded-full bg-blue-100 p-2">

                <Clock
                    size={18}
                    className="text-blue-700"
                />

            </div>

            <div className="flex-1">

                <h4 className="font-medium">

                    {title}

                </h4>

                <p className="mt-1 text-sm text-slate-500">

                    {description}

                </p>

            </div>

            <span className="text-xs text-slate-400">

                {time}

            </span>

        </div>

    )

}