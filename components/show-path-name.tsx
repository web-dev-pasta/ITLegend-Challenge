"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function BeautifyPathName(pathname: string) {
  return pathname
    .split("-")
    .filter(Boolean)
    .map((e) => e[0].toUpperCase() + e.slice(1))
    .join(" ");
}

function ShowPathName() {
  const pathname = usePathname();
  const currentPath = pathname
    .split("/")
    .filter(Boolean)
    .map((e, index, array) => ({
      route: "/" + array.slice(0, index + 1).join("/"),
      path: BeautifyPathName(e),
    }));
  return (
    <nav className="flex items-center gap-1">
      <Link href={"/"}>Home</Link>

      {currentPath.map((e) => {
        const isActive = pathname === e.route;

        return (
          <div key={e.route} className="flex items-center gap-1">
            <ChevronRight size={12} />

            <Link
              href={e.route}
              className={
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {e.path}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export default ShowPathName;
