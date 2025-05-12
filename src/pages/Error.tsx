import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function Error() {
  return (
    <>
      <div className="w-full h-full bg-black text-white flex flex-col justify-center items-center gap-2 text-center">
        <ExclamationTriangleIcon className="h-12 w-auto self-center" />
        <h1 className="text-3xl font-black">An error has ocurred</h1>
        <h5 className="text-xs">v1.2.0</h5>
      </div>
    </>
  );
}
