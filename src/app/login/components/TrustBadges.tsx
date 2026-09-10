import {
  ShieldCheck,
  LockKeyhole,
  UserCog,
} from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Secure Login",
    description: "Protected",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: UserCog,
    title: "Role Access",
    description: "Controlled",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: LockKeyhole,
    title: "Encrypted",
    description: "Protected",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

      {badges.map((badge) => {
        const Icon = badge.icon;

        return (
          <div
            key={badge.title}
            className="
              flex
              flex-col
              items-center
              px-2
              py-3
              text-center
              transition
              hover:bg-white
            "
          >

            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                ${badge.bg}
              `}
            >
              <Icon
                size={17}
                className={badge.color}
              />
            </div>

            <h3 className="mt-2 text-[10px] font-bold text-slate-700 sm:text-[11px]">
              {badge.title}
            </h3>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {badge.description}
            </p>

          </div>
        );
      })}

    </div>
  );
}