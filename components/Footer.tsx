import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Coffee, ArrowUpRight, Globe } from 'lucide-react';

const Footer = () => {
    const portfolioUrl = "https://manishshetty.dev";
    const socialLinks = [
        { name: 'GitHub', href: 'https://github.com/ManishRShetty', icon: Github },
        { name: 'Twitter', href: 'https://x.com/ManishShetty017', icon: Twitter },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/manishrshetty/', icon: Linkedin },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { y: 16, opacity: 0, filter: 'blur(8px)' },
        visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 120, damping: 20 },
        },
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="relative mt-20 pt-12 pb-8 border-t border-white/[0.06] overflow-hidden"
        >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#04D939]/[0.04] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

                    {/* LEFT: Identity */}
                    <motion.div variants={itemVariants} className="flex-1 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                Manish R Shetty
                            </h3>
                            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
                                Engineering student & Designer. Building interfaces that feel like magic.
                            </p>
                        </div>

                        {/* Buy Me A Coffee */}
                        <motion.a
                            href="https://buymeacoffee.com/manishshetty"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#091f2c] border border-white/[0.08] rounded-2xl transition-all cursor-pointer group hover:border-[#04D939]/30"
                        >
                            <div className="p-1.5 bg-white/5 rounded-full text-white/50 group-hover:text-[#04D939] group-hover:bg-[#04D939]/10 transition-colors">
                                <Coffee size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-[0.15em] text-white/25 font-bold group-hover:text-[#04D939]/50 transition-colors">Fuel the work</span>
                                <span className="text-sm font-semibold text-white/80 group-hover:text-[#04D939] transition-colors">Buy me a coffee</span>
                            </div>
                        </motion.a>
                    </motion.div>

                    {/* RIGHT: Links */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-5 md:text-right md:items-end">
                        {/* Portfolio */}
                        <div className="space-y-1.5">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">Explore</h4>
                            <a
                                href={portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 text-base font-medium text-white/70 hover:text-[#04D939] transition-colors"
                            >
                                <Globe size={16} className="text-white/30 group-hover:text-[#04D939] group-hover:rotate-12 transition-all duration-500" />
                                <span>Portfolio</span>
                                <ArrowUpRight size={14} className="text-white/30 group-hover:text-[#04D939] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </a>
                        </div>

                        {/* Socials */}
                        <div className="space-y-1.5">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">Connect</h4>
                            <div className="flex gap-3 md:justify-end">
                                {socialLinks.map((platform) => (
                                    <a
                                        key={platform.name}
                                        href={platform.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white/[0.03] hover:bg-[#04D939]/10 border border-white/[0.06] hover:border-[#04D939]/30 rounded-xl transition-all group"
                                        title={platform.name}
                                    >
                                        <platform.icon size={16} className="text-white/30 group-hover:text-[#04D939] transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    variants={itemVariants}
                    className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-3"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#04D939] animate-pulse" />
                        <span className="text-[11px] text-white/25 font-light">
                            All systems nominal · © {new Date().getFullYear()} TraceLab
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/15 bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.04]">
                        MANGALURU · INDIA
                    </span>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;