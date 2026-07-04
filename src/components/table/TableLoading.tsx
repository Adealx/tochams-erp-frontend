export default function TableLoading() {

    return (

        <div className="space-y-3">

            {[1,2,3,4,5].map((row)=>(

                <div
                    key={row}
                    className="
                    h-14
                    rounded-xl
                    bg-slate-200
                    animate-pulse
                    "
                />

            ))}

        </div>

    );

}