interface Props{

    title:string;

    subtitle?:string;

}

export default function SectionTitle({

    title,

    subtitle,

}:Props){

    return(

        <div className="mb-5">

            <h2 className="text-xl font-semibold">

                {title}

            </h2>

            {subtitle &&(

                <p className="text-sm text-slate-500 mt-1">

                    {subtitle}

                </p>

            )}

        </div>

    )

}