import {
  ShieldCheck,
  LockKeyhole,
  UserCog,
} from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Secure Login",
    description: "Enterprise-grade authentication",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: UserCog,
    title: "Role Based Access",
    description: "Department-specific permissions",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: LockKeyhole,
    title: "Encrypted Connection",
    description: "Protected data transmission",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {badges.map((badge) => {
        const Icon = badge.icon;

        return (
          <div
            key={badge.title}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white
              hover:shadow-md
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                ${badge.bg}
              `}
            >
              <Icon
                size={22}
                className={badge.color}
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              {badge.title}
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}