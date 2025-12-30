// import React from 'react';
// import useAuth from '../../../hooks/useAuth';
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';

// const formatDate = (iso) => new Date(iso).toLocaleString();

// const PaymentHistory = () => {
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();

//     const { isPending, data: payments = [] } = useQuery({
//         queryKey: ['payments', user.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/payments?email=${user.email}`);
//             return res.data;
//         }
//     })

//     if (isPending) {
//         return '...loading'
//     }

//     return (
//         <div className="overflow-x-auto shadow-md rounded-xl">
//             <table className="table table-zebra w-full">
//                 <thead className="bg-base-200 text-base font-semibold">
//                     <tr>
//                         <th>#</th>
//                         <th>Parcel ID</th>
//                         <th>Amount</th>
//                         <th>Transaction</th>
//                         <th>Paid At</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {payments?.length > 0 ? (
//                         payments.map((p, index) => (
//                             <tr key={p.transactionId}>
//                                 <td>{index + 1}</td>
//                                 <td className="truncate" title={p.parcelId}>
//                                     {p.parcelId}...
//                                 </td>
//                                 <td>৳{p.amount}</td>
//                                 <td className="font-mono text-sm">
//                                     <span title={p.transactionId}>
//                                         {p.transactionId}...
//                                     </span>
//                                 </td>
//                                 <td>{formatDate(p.paid_at_string)}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="7" className="text-center text-gray-500 py-6">
//                                 No payment history found.
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default PaymentHistory;






import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaHistory, FaSearch, FaCreditCard, FaDollarSign } from 'react-icons/fa';

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_COLOR = '#F04C2B';
const SECONDARY_COLOR = '#0D5EA6';
const ACCENT_COLOR = '#03373D';

// ডেট ফরম্যাটিং ফাংশন
const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const PaymentHistory = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        isPending,
        data: payments = [],
        isError,
        error
    } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    })

    // সংক্ষিপ্ত ট্রানজেকশন ID দেখানোর ফাংশন
    const truncateId = (id, length = 8) => {
        if (!id) return "N/A";
        return `${id.substring(0, length)}...`;
    };


    // --- রেন্ডারিং স্টেটস ---

    if (loading || isPending) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-gray-50">
                <span className="loading loading-spinner loading-lg" style={{ color: PRIMARY_COLOR }}></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center bg-red-50 p-8 rounded-lg mt-10 shadow-lg border border-red-300">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
                <p className="text-gray-700">Failed to fetch payment history. Message: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="mb-8 p-6 bg-white rounded-xl shadow-lg border-b-4" style={{ borderBottomColor: PRIMARY_COLOR }}>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center" style={{ color: ACCENT_COLOR }}>
                    <FaHistory className="mr-3" style={{ color: PRIMARY_COLOR }} />
                    Payment History
                </h1>
                <p className="text-gray-600 mt-1">Review all your successful parcel payment transactions.</p>
            </header>

            {/* পেমেন্ট হিস্টোরি টেবিল (ডেস্কটপ/ট্যাবলেট) */}
            <div className="hidden lg:block overflow-x-auto rounded-xl shadow-2xl border border-gray-100 bg-white">
                {/* <table> এবং <thead>/<tbody> এর মাঝে কোনো অতিরিক্ত ফাঁকা স্থান রাখা হয়নি */}
                <table className="table w-full min-w-[700px] text-gray-700">
                    <thead className="text-white text-base font-semibold uppercase tracking-wider" style={{ backgroundColor: ACCENT_COLOR }}>
                        <tr className="shadow-md">
                            <th className="p-4 rounded-tl-xl">#</th>
                            <th className="p-4">Parcel ID</th>
                            <th className="p-4 text-center">Amount</th>
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4 rounded-tr-xl">Paid At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.length > 0 ? (
                            payments.map((p, index) => (
                                <tr
                                    key={p.transactionId || index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="font-medium text-gray-600">{index + 1}</td>

                                    {/* Parcel ID */}
                                    <td className="font-mono text-sm max-w-[150px] truncate" title={p.parcelId}>
                                        <div className="flex items-center space-x-2">
                                            <FaSearch className="text-gray-400" />
                                            <span>{truncateId(p.parcelId, 12)}</span>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="font-extrabold text-lg text-center" style={{ color: SECONDARY_COLOR }}>
                                        <span className="flex items-center justify-center">
                                            <FaDollarSign className="w-4 h-4 mr-1" />
                                            {p.amount ? p.amount.toFixed(2) : '0.00'}
                                        </span>
                                    </td>

                                    {/* Transaction ID */}
                                    <td className="font-mono text-xs max-w-[200px] truncate" title={p.transactionId}>
                                        <span className="inline-block px-3 py-1 rounded-full text-white" style={{ backgroundColor: SECONDARY_COLOR }}>
                                            {truncateId(p.transactionId, 10)}
                                        </span>
                                    </td>

                                    {/* Paid At */}
                                    <td className="text-sm text-gray-600">
                                        {formatDate(p.paid_at_string)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-10 text-lg">
                                    <FaCreditCard className="inline-block text-4xl mr-3" style={{ color: SECONDARY_COLOR }} />
                                    No payment history found for your account.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* মোবাইল / ট্যাবলেট ভিউয়ের জন্য কার্ড লেআউট */}
            <div className="lg:hidden mt-8 space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: ACCENT_COLOR }}>Recent Transactions (Card View)</h2>
                {payments?.length > 0 ? (
                    payments.map((p, index) => (
                        <div key={p.transactionId || index} className="p-4 bg-white rounded-lg shadow-xl border-l-4 transition duration-200 hover:shadow-2xl" style={{ borderLeftColor: SECONDARY_COLOR }}>
                            <div className="flex justify-between items-center border-b pb-2 mb-2">
                                <p className="font-extrabold text-2xl" style={{ color: ACCENT_COLOR }}>
                                    ৳{p.amount ? p.amount.toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">Paid:</span> {formatDate(p.paid_at_string)}
                                </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 truncate" title={p.parcelId}>
                                <span className="font-semibold mr-1">Parcel ID:</span> {p.parcelId}
                            </p>
                            <p className="text-xs font-mono text-gray-400 mt-1 truncate" title={p.transactionId}>
                                <span className="font-semibold mr-1">Txn ID:</span> {p.transactionId}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4 bg-white rounded-lg shadow-md">
                        <FaCreditCard className="inline-block text-3xl mr-2" style={{ color: SECONDARY_COLOR }} /> No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;