import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import "./Desktop.scss";

export default function Desktop() {
  return (
    <>
      <div className="w-full h-full bg-black text-white flex flex-col justify-center items-center gap-2 text-center">
        <ExclamationTriangleIcon className="h-12 w-auto self-center" />
        <h1 className="text-3xl font-black">
          Open this page on a <i>phone</i> and even install it!
        </h1>
      </div>
    </>
  );
}
