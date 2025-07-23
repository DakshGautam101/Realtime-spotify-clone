import { RotateCw } from "lucide-react";

const RotationWarning = () => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex-col items-center justify-center text-white text-center gap-4 hidden portrait:flex md:hidden">
      <RotateCw className="size-12 animate-spin" />
      <p className="text-lg font-medium px-4">
        Please rotate your device for a better experience
      </p>
    </div>
  );
};

export default RotationWarning;