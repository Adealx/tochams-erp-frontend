import { ReactNode } from "react";

interface Props{

    title:string;

    children:ReactNode;

    action?:ReactNode;

}

export default function InfoCard({

    title,

    children,

    action,

}:Props){

    return(

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

                <h3 className="font-semibold text-slate-800">

                    {title}

                </h3>

                {action}

            </div>

            <div className="p-5">

                {children}

            </div>

        </div>

    )

}