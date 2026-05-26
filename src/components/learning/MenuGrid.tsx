'use client';
import { BgColorsOutlined, FontSizeOutlined, GlobalOutlined, NumberOutlined, PictureOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { JSX, memo, useMemo } from "react";

interface MenuItem {
    title: string;
    icon: JSX.Element;
    tpsglobal: number;
    color: string;
}

interface MenuGridProps {
    onItemClick: (item: MenuItem) => void;
}

const MenuGrid = memo(({ onItemClick }: MenuGridProps) => {
    const menuItems: MenuItem[] = useMemo(
        () => [
            { title: "Nombre", icon: <NumberOutlined />, tpsglobal: 0, color: "bg-blue-500" },
            { title: "Lettre", icon: <FontSizeOutlined />, tpsglobal: 3, color: "bg-green-500" },
            { title: "Image", icon: <PictureOutlined />, tpsglobal: 2, color: "bg-purple-500" },
            { title: "Couleur", icon: <BgColorsOutlined />, tpsglobal: 1, color: "bg-red-500" },
            { title: "Global", icon: <GlobalOutlined />, tpsglobal: 4, color: "bg-orange-500" },
            { title: "Aide", icon: <QuestionCircleOutlined />, tpsglobal: -1, color: "bg-gray-500" },
        ],
        []
    );

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key="menu"
                    className="grid grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.title}
                            onClick={() => onItemClick(item)}
                            className={clsx(
                                "p-6 flex flex-col items-center justify-center rounded-xl shadow-md transition-all duration-300 text-white",
                                "hover:bg-opacity-80 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white",
                                item.color
                            )}
                            aria-label={`Accéder à ${item.title}`}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                        >
                            <div className="text-5xl">{item.icon}</div>
                            <p className="mt-4 font-semibold">{item.title}</p>
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div >
    );
});

MenuGrid.displayName = "MenuGrid";

export default MenuGrid;
export type { MenuItem };
