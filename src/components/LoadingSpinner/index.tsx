import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <Image
      src="/loading.svg"
      alt="Loading"
      width={20}
      height={20}
      className="h-5 w-5 animate-spin"
    />
  );
}
