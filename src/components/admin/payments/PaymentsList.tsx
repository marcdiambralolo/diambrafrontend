'use client';
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, Eye, Smartphone, User, XCircle } from 'lucide-react';
import CacheLink from '@/components/commons/CacheLink';
import React from 'react';

interface Payment {
    id: string;
    reference: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    createdAt: string;
    status: string;
    method?: string;
}

interface PaymentsListProps {
    payments: Payment[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-orange-100 text-orange-700';
        case 'failed': return 'bg-red-100 text-red-700';
        case 'cancelled': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed': return <CheckCircle className="w-2.5 h-2.5" />;
        case 'pending': return <Clock className="w-2.5 h-2.5" />;
        case 'failed': return <XCircle className="w-2.5 h-2.5" />;
        case 'cancelled': return <AlertCircle className="w-2.5 h-2.5" />;
        default: return <AlertCircle className="w-2.5 h-2.5" />;
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'completed': return 'Réussi';
        case 'pending': return 'En attente';
        case 'failed': return 'Échoué';
        case 'cancelled': return 'Annulé';
        default: return status;
    }
};

const getMethodText = (method: string) => {
    switch (method) {
        case 'orange_money': return 'Orange Money';
        case 'mtn_money': return 'MTN Money';
        case 'moov_money': return 'Moov Money';
        case 'wave': return 'Wave';
        default: return method;
    }
};

const getMethodColor = (method: string) => {
    switch (method) {
        case 'orange_money': return 'bg-orange-50 text-orange-700';
        case 'mtn_money': return 'bg-yellow-50 text-yellow-700';
        case 'moov_money': return 'bg-blue-50 text-blue-700';
        case 'wave': return 'bg-[#EEF4FF] text-[#2E5AA6]';
        default: return 'bg-gray-50 text-gray-700';
    }
};

const PaymentsList: React.FC<PaymentsListProps> = ({
    payments,
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {payments.map((payment) => (
            <div
                key={payment.id}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg transition-all"
            >
                <div className="flex items-start justify-between mb-2.5">
                    <div className="flex-1 min-w-0">

                        <p className="text-lg font-bold text-gray-900">{payment.amount.toLocaleString()} F</p>
                    </div>
                </div>

                <div className="space-y-1 mb-2.5 pb-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{payment.customerName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Smartphone className="w-3 h-3 flex-shrink-0" />
                        {payment.customerPhone}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>{getStatusIcon(payment.status)}{getStatusText(payment.status)}</span>
                    {payment.method && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                            <CreditCard className="w-2.5 h-2.5 mr-0.5" />
                            {getMethodText(payment.method)}
                        </span>
                    )}
                </div>
                <CacheLink
                    href={`/admin/payments/${payment.id}`}
                    className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700 transition-colors"
                >
                    <Eye className="w-3 h-3" />
                    Détails
                </CacheLink>
            </div>
        ))}
    </div>
);

export default PaymentsList;