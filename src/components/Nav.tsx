import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      {links.map((link: any) => (
        <Link
          key={link.alt}
          href={`/${link.alt}`}
          className="w-full border-2 overflow-hidden  flex flex-col gap-4 rounded-xl"
        >
          <Image
            src={link.src}
            alt={link.alt}
            width={link.width}
            height={link.height}
          />
          <div className="border-t-2 text-center p-2">{link.title}</div>
        </Link>
      ))}
    </>
  );
}
const links = [
  {
    src: "/images/arc.png",
    alt: "arc",
    width: 400,
    height: 400,
    title: "경기도 ARC",
  },
];
