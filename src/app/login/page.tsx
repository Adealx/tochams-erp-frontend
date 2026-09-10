"use client";

import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 lg:grid lg:grid-cols-[56%_44%]">
      <LeftPanel />
      <RightPanel />
    </main>
  );
}