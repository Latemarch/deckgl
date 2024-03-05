import Link from "next/link";

export default function layout({ children }: any) {
  return (
    <div>
      <Link
        href={"/"}
        className="text-3xl fixed z-50 left-10 top-10 p-2 px-4 rounded-xl border-2 hover:bg-blue-400"
      >
        🔙
      </Link>
      {children}
    </div>
  );
}
