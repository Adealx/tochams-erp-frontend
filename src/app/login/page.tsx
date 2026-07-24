"use client";

import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

export default function LoginPage() {
  return (
    <main
      className="
        h-screen
        overflow-hidden
        lg:grid
        lg:grid-cols-[50%_50%]
      "
    >
      <LeftPanel />

      <RightPanel />
    </main>
  );
}