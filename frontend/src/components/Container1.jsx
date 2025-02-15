import img1 from "../assets/ps4.png";
import img2 from "../assets/ps3.png";
export default function Container1() {
  return (
    <div className="container1 flex h-full flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-[#dee8ef] bg-[#fdfeff90] p-2 md:p-10">
      <img
        className="max-h-56 rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
        src={img1}
        alt=""
      />
      <img
        className="max-h-72 rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
        src={img2}
        alt=""
      />
    </div>
  );
}
