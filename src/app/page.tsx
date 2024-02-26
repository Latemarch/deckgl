import ArcExample from "@/components/ArcExample";
import ArcExampleWithHtml from "@/components/ArcExampleWithHtml";
import DashboardMap from "@/components/DashboardMap";
import { getMap, getMapProperties } from "@/service/server/getFile";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function Home() {
  const districtInfo = getMapProperties("districtInfo.json");
  const topoJson = getMap("koreaTopo.json");
  const handleClick = () => {
    console.log("Im here");
  };

  return (
    <div className="w-full h-full grid grid-cols-3 justify-center max-w-5xl gap-10 p-10">
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
    </div>
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
