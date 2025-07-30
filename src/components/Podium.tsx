import Image from "next/image";

type Player = {
  name: string;
  points: number;
};

type PodiumProps = {
  players: Player[]; // sorted descending by points
};

export default function Podium({ players }: PodiumProps) {
  if (!players || players.length < 3) return null;

  const getImagePath = (name: string, place: number) => {
    return `/avatars/${name.toLowerCase()}${place}.png`;
  };

  return (
    <div className="w-full flex justify-center items-end py-12 translate-x-6 md:translate-x-16">
      <div className="relative w-[800px] h-[600px]  mx-auto -translate-x-[50px]">
        {/* Podium base */}
        <Image
          src="/avatars/podium.png"
          alt="podium"
          width={800}
          height={240}
          className="absolute -bottom-[230px] left-[50%] -translate-x-1/2 z-0"
        />

        {/* Second place - left */}
        <div className="absolute bottom-[155px] left-[4%] flex flex-col items-center z-10">
          <Image
            src={getImagePath(players[1].name, 2)}
            alt={`${players[1].name} 2nd place`}
            width={200+200*.45}
            height={380+380*.45}
          />
        </div>

        {/* First place - center */}
        <div className="absolute bottom-[240px] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <Image
            src={getImagePath(players[0].name, 1)}
            alt={`${players[0].name} 1st place`}
            width={240+240*.45}
            height={420+420*.45}
          />
        </div>

        {/* Third place - right */}
        <div className="absolute bottom-[125px] right-[4%] flex flex-col items-center z-10">
          <Image
            src={getImagePath(players[2].name, 3)}
            alt={`${players[2].name} 3rd place`}
            width={200+200*.45}
            height={380+380*.45}
          />
        </div>
      </div>
    </div>
  );
}
