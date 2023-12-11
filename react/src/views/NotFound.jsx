import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ y: "100vh" }}
      animate={{
        y: "0vh",
        transition: {
          type: "spring",
          damping: 100,
          stiffness: 500,
        },
      }}
      className="fixed top-0 left-0 w-full h-screen flex justify-center items-center p-2 bg-gradient-to-b from-main to-[#3E454F] z-50"
    >
      <div
        //   initial={{scale: 0.2}}
        //   animate={{
        //     scale: 1,
        //     transition: {
        //       type: "spring",
        //       damping: 100,
        //       stiffness: 500,
        //     },
        //   }}
        className="max-w-3xl text-white md:text-xl lg:text-3xl text-center"
      >
        404 | Page Not Found
        <br /> Maaf, Halaman yang Anda cari tidak Ditemukan.
      </div>
    </motion.div>
  );
}
