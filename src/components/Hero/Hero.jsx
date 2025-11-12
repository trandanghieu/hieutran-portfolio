import { Briefcase, GraduationCap, Award } from 'lucide-react';
import { motion } from "framer-motion";
import avatar from "../../assets/1762969814216.png";
import isbLogo from "../../assets/isb.jpg";
import zigexnLogo from "../../assets/zigexn.png";
import iigLogo from "../../assets/iig.png";
import jlptLogo from "../../assets/jlpt.webp";
import dutLogo from "../../assets/dut.jpg";

const HERO_CONTENT =
  "I am a passionate Java Developer with a strong foundation in software development and a keen interest in building scalable applications. Currently working at ISB Vietnam Company, I bring hands-on experience in full-stack development and a commitment to continuous learning.";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const Hero = () => {
  const startDate = new Date(2025, 2); // Tháng 3/2025 (JS đếm tháng từ 0)
  const now = new Date();

  const diffInMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;

  const experienceDuration =
    years > 0
      ? `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`
      : `${months} mo${months > 1 ? "s" : ""}`;

  return (
    <div className="pb-4 lg:mb-36 max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap lg:flex-row-reverse mb-12"
      >
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center lg:p-8">
            <img
              src={avatar}
              alt="Hieu Tran"
              className="border border-stone-900 rounded-3xl w-[90%] max-w-[320px] h-auto object-cover"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col items-center lg:items-start mt-10">
            <h2 className="pb-2 text-4xl tracking-tighter lg:text-8xl text-white">
              Hieu Tran
            </h2>
            <span className="text-stone-200 text-4xl tracking-tight font-medium">
              Software Engineer
            </span>
            <p className="my-2 max-w-lg py-6 text-2xl leading-relaxed tracking-tighter text-justify text-stone-300">
              {HERO_CONTENT}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-12 border border-stone-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-semibold flex items-center gap-3 text-white">
            <Briefcase className="w-8 h-8" />
            Experience
          </h3>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Current Job */}
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={isbLogo} alt="ISB Vietnam" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white">Java Software Developer</h4>
              <p className="text-stone-300">ISB Vietnam Company (IVC) · Full-time</p>
              <p className="text-stone-400 text-sm">
                Mar 2025 - Present · {experienceDuration}
              </p>
              <p className="text-stone-400 text-sm">Ho Chi Minh City, Vietnam · On-site</p>
            </div>
          </motion.div>

          {/* Previous Job */}
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={zigexnLogo} alt="ZIGExN VeNtura" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white">Intern Ruby On Rails</h4>
              <p className="text-stone-300">ZIGExN VeNtura Co., Ltd · Full-time</p>
              <p className="text-stone-400 text-sm">Sep 2024 - Dec 2024 · 4 mos</p>
              <p className="text-stone-400 text-sm">Da Nang City, Vietnam · On-site</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Education Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12 border border-stone-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-semibold flex items-center gap-3 text-white">
            <GraduationCap className="w-8 h-8" />
            Education
          </h3>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-4">
          <motion.div variants={fadeInUp} className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <img src={dutLogo} alt="DUT" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div variants={fadeInUp} className="flex-1">
            <h4 className="text-xl font-semibold text-white">
              Danang University of Science and Technology
            </h4>
            <p className="text-stone-300">Bachelor&rsquo;s degree, Information Technology</p>
            <p className="text-stone-400 text-sm">Aug 2020 - Aug 2024</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Licenses & Certifications Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="border border-stone-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-semibold flex items-center gap-3 text-white">
            <Award className="w-8 h-8" />
            Licenses & certifications
          </h3>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
          {/* TOEIC */}
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={iigLogo} alt="IIG Vietnam" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white">TOEIC 755</h4>
              <p className="text-stone-300">IIG Vietnam</p>
              <p className="text-stone-400 text-sm">Issued Nov 2025 · Expires Nov 2027</p>
            </div>
          </motion.div>

          {/* JLPT */}
          <motion.div variants={fadeInUp} className="flex gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={jlptLogo} alt="JLPT" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white">N4</h4>
              <p className="text-stone-300">JLPT - Japanese Language Proficiency Test</p>
              <p className="text-stone-400 text-sm">Issued Dec 2024</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;