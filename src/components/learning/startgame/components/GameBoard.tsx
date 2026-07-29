'use client';
import { memo } from 'react';
import PloaderFixe from './PloaderFixe';
import Ploader from './Ploader';

const GameBoard = memo(({ showPun, niveau, casesdujeuencours, casesinitiales, pieces, selectedCase, selectCase, tpsglobal }: any) => (
    <div className="w-full max-w-md text-center mb-2">
        {showPun ? (
            <PloaderFixe
                niveau={niveau}
                casesun={casesinitiales}
                pieces={pieces}
            />
        ) : (
            <Ploader
                niveau={niveau}
                cases={casesdujeuencours}
                selectedCase={selectedCase}
                selectCase={selectCase}
                pieces={pieces}
                tpsglobal={tpsglobal}
            />
        )}
    </div>
));

export default GameBoard;