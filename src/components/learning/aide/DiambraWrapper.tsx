"use client";
import { Badge, Card, Space } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useMemo } from "react";

interface DiambraWrapperProps {
    titre: string;
    children: React.ReactNode;
    randomImage: string;
    onlineStatus: { text: string; color: string; };
}

const MemoizedButton = memo(() => {
    const handleClick = () => {
        window.location.href = '/star/learning';
    };

    return (
        <motion.button
            onClick={handleClick}
            className="mr-4 mt-1 mb-1 flex items-center justify-center w-10 h-10 rounded-full transition duration-100 shadow-md text-white text-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retour à l'accueil"
        >
            🏠
        </motion.button>
    );
});

MemoizedButton.displayName = "MemoizedButton";

const MemoizedCardWrapper = memo(({ text, color, title, children }: { text: string, color: string, title: React.ReactNode, children: React.ReactNode }) => (
    <Space direction="vertical" size="middle" className="w-full m-0 p-0">
        <Badge.Ribbon text={text} color={color}>
            <Card title={title} size="small" className="rounded-2xl bg-white shadow-md">
                {children}
            </Card>
        </Badge.Ribbon>
    </Space>
));

MemoizedCardWrapper.displayName = "MemoizedCardWrapper";

const DiambraWrapper: React.FC<DiambraWrapperProps> = memo(({ onlineStatus, randomImage, titre, children }) => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <motion.div
            key="main" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }} transition={{ duration: 0.2 }}
            className="w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300"
        >
            <div className="w-full max-w-md">
                <MemoizedCardWrapper text={onlineStatus.text} color={onlineStatus.color}
                    title={
                        <div className="flex justify-between w-3/5 items-center">
                            <MemoizedButton />
                            <span className="text-lg font-semibold">{titre}</span>
                        </div>
                    }
                >
                    {children}
                    <div className="w-full mt-6 mb-4 overflow-hidden rounded-lg shadow-lg flex flex-col gap-4">
                        <Image src={randomImage} width={200} height={100} alt={titre} className="rounded-lg w-full object-cover" />
                        <footer className="bg-gray-800 text-gray-300 text-center py-1 text-sm">
                            © {currentYear} DIAMBRA CORPORATION
                        </footer>
                    </div>
                </MemoizedCardWrapper>
            </div>
        </motion.div>
    );
});

DiambraWrapper.displayName = "DiambraWrapper";

export default DiambraWrapper;