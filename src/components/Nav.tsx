import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      {links.map((link: any) => (
        <Link
          key={link.alt}
          href={`/${link.alt}`}
          className="w-full border-2 overflow-hidden  flex flex-col rounded-xl"
        >
          <div className="w-full h-52 relative">
            <Image
              src={link.src}
              alt={link.alt}
              layout="fill"
              objectFit="cover"
            />
          </div>
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
  {
    src: "/images/staticmap.png",
    alt: "staticmap",
    width: 400,
    height: 400,
    title: "정적 폴리곤",
  },
];
