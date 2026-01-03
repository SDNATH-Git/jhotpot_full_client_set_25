// import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import { useQuery } from '@tanstack/react-query';
// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import useAuth from '../../../hooks/useAuth';
// import Swal from 'sweetalert2';
// import useTrackingLogger from '../../../hooks/useTrackingLogger';

// const PaymentForm = () => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const { parcelId } = useParams();
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();
//     const { logTracking } = useTrackingLogger();
//     const navigate = useNavigate();

//     const [error, setError] = useState('');


//     const { isPending, data: parcelInfo = {} } = useQuery({
//         queryKey: ['parcels', parcelId],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/parcels/${parcelId}`);
//             return res.data;
//         }
//     })

//     if (isPending) {
//         return '...loading'
//     }

//     const amount = parcelInfo.cost;
//     const amountInCents = amount * 100;

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!stripe || !elements) {
//             return;
//         }

//         const card = elements.getElement(CardElement);

//         if (!card) {
//             return;
//         }

//         // step- 1: validate the card
//         const { error, paymentMethod } = await stripe.createPaymentMethod({
//             type: 'card',
//             card
//         })

//         if (error) {
//             setError(error.message);
//         }
//         else {
//             setError('');
//             console.log('payment method', paymentMethod);

//             // step-2: create payment intent
//             const res = await axiosSecure.post('/create-payment-intent', {
//                 amountInCents,
//                 parcelId
//             })

//             const clientSecret = res.data.clientSecret;

//             // step-3: confirm payment
//             const result = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: {
//                     card: elements.getElement(CardElement),
//                     billing_details: {
//                         name: user.displayName,
//                         email: user.email
//                     },
//                 },
//             });

//             if (result.error) {
//                 setError(result.error.message);
//             } else {
//                 setError('');
//                 if (result.paymentIntent.status === 'succeeded') {
//                     console.log('Payment succeeded!');
//                     const transactionId = result.paymentIntent.id;
//                     // step-4 mark parcel paid also create payment history
//                     const paymentData = {
//                         parcelId,
//                         email: user.email,
//                         amount,
//                         transactionId: transactionId,
//                         paymentMethod: result.paymentIntent.payment_method_types
//                     }

//                     const paymentRes = await axiosSecure.post('/payments', paymentData);
//                     if (paymentRes.data.insertedId) {

//                         // ✅ Show SweetAlert with transaction ID
//                         await Swal.fire({
//                             icon: 'success',
//                             title: 'Payment Successful!',
//                             html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
//                             confirmButtonText: 'Go to My Parcels',
//                         });


//                         await logTracking(
//                             {
//                                 tracking_id: parcelInfo.tracking_id,
//                                 status: "payment_done",
//                                 details: `Paid by ${user.displayName}`,
//                                 updated_by: user.email,
//                             }
//                         )
//                         // ✅ Redirect to /myParcels
//                         navigate('/dashboard/myParcels');

//                     }
//                 }
//             }
//         }





//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto mt-16 border-t-4 border-b-4 border-[#03373D]">
//                 <CardElement className="p-2 border rounded">
//                 </CardElement>
//                 <button
//                     type='submit'
//                     className="btn bg-[#F04C2B] text-xl rounded-lg text-white font-bold w-full"
//                     disabled={!stripe}
//                 >
//                     Pay ${amount}
//                 </button>
//                 {
//                     error && <p className='text-red-500'>{error}</p>
//                 }
//             </form>
//         </div>
//     );
// };

// export default PaymentForm;





import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';
import { FaLock, FaTruckMoving, FaCreditCard } from 'react-icons/fa'; // নতুন আইকন ইম্পোর্ট করা হলো

// --- কাস্টম কালার কনস্ট্যান্টস ---
const PRIMARY_BRAND_COLOR = '#0D5EA6'; // গাঢ় নীল (Accent/Header)
const SECONDARY_BRAND_COLOR = '#F04C2B'; // লাল/কমলা (Pay Button)
const DARK_TEXT_COLOR = '#03373D'; // গাঢ় ছায়া (Text/Borders)

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { logTracking } = useTrackingLogger();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false); // পেমেন্ট প্রসেসিং স্টেট যোগ করা হলো

    // Parcel Data Fetching
    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    })

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-screen" style={{ color: PRIMARY_BRAND_COLOR }}>
                Loading Parcel Details...
            </div>
        )
    }

    const amount = parcelInfo.cost;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true); // প্রসেসিং শুরু

        // step- 1: validate the card
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
            setProcessing(false);
            return;
        }

        setError('');

        // step-2: create payment intent
        const res = await axiosSecure.post('/create-payment-intent', {
            amountInCents,
            parcelId
        })

        const clientSecret = res.data.clientSecret;

        // step-3: confirm payment
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user?.displayName,
                    email: user?.email
                },
            },
        });

        if (result.error) {
            setError(result.error.message);
            setProcessing(false);
        } else {
            setError('');
            if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;

                // step-4 mark parcel paid also create payment history
                const paymentData = {
                    parcelId,
                    email: user?.email,
                    amount,
                    transactionId: transactionId,
                    paymentMethod: result.paymentIntent.payment_method_types[0] // প্রথম পদ্ধতি ব্যবহার করা হলো
                }

                const paymentRes = await axiosSecure.post('/payments', paymentData);

                if (paymentRes.data.insertedId) {
                    // ✅ Show SweetAlert
                    await Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        html: `Your payment has been completed. <br/><strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                        confirmButtonText: 'Go to My Parcels',
                        customClass: {
                            confirmButton: 'bg-green-600 hover:bg-green-700'
                        }
                    });

                    // ✅ Log Tracking Status
                    await logTracking(
                        {
                            tracking_id: parcelInfo.tracking_id,
                            status: "Payment Done", // স্ট্যাটাস পরিবর্তন
                            details: `Parcel cost paid successfully. Transaction ID: ${transactionId}`,
                            updated_by: user.email,
                        }
                    )

                    // ✅ Redirect
                    navigate('/dashboard/myParcels');
                }
            }
        }
        setProcessing(false); // প্রসেসিং শেষ
    }

    // Card Element Styling
    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '18px',
                color: DARK_TEXT_COLOR,
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px',
            },
            invalid: {
                color: SECONDARY_BRAND_COLOR,
            },
        },
    };

    return (
        <div className="min-h-screen p-4 flex items-start justify-center" style={{ backgroundColor: '#f3f4f6' }}>
            <div className="w-full max-w-2xl mt-10 md:mt-20">

                {/* Header */}
                <h1 className="text-xl md:text-3xl  font-extrabold text-center mb-10 bg-white p-3 border-b-4 boder-[#F04C2B] rounded-xl " style={{ color: PRIMARY_BRAND_COLOR }}>
                    <FaCreditCard className="inline-block mr-3" style={{ color: SECONDARY_BRAND_COLOR }} />
                    Confirm Your Payment
                </h1>

                {/* Main Content Grid: Parcel Info & Payment Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 1. Parcel Information Summary Card (Left) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg h-full border-t-4" style={{ borderColor: DARK_TEXT_COLOR }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: DARK_TEXT_COLOR }}>
                            <FaTruckMoving className="inline-block mr-2" /> Shipment Details
                        </h2>
                        <hr className="mb-4" style={{ borderColor: PRIMARY_BRAND_COLOR, opacity: 0.5 }} />

                        <div className="space-y-3 text-lg">
                            <p><strong>Parcel ID:</strong> <span className="font-semibold" style={{ color: PRIMARY_BRAND_COLOR }}>{parcelInfo.tracking_id || 'N/A'}</span></p>
                            <p><strong>Sender Email:</strong> {user?.email}</p>
                            <p><strong>Total Cost:</strong> <span className="text-2xl font-extrabold" style={{ color: SECONDARY_BRAND_COLOR }}>${amount}</span></p>
                            <p className="text-sm text-gray-500 mt-4">
                                *This payment covers the full shipping cost for your delivery.
                            </p>
                        </div>
                    </div>

                    {/* 2. Stripe Payment Form Card (Right) */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 bg-white p-6 rounded-xl shadow-lg border-t-4"
                        style={{ borderColor: DARK_TEXT_COLOR }}
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: DARK_TEXT_COLOR }}>
                            <FaCreditCard className="mr-2" /> Payment Method
                        </h2>

                        {/* Card Element Input */}
                        <div className="border rounded-xl p-3" style={{ borderColor: PRIMARY_BRAND_COLOR }}>
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>

                        {/* Error Message */}
                        {error && <p className='text-base font-medium' style={{ color: SECONDARY_BRAND_COLOR }}>{error}</p>}

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className="btn inline-flex items-center justify-center text-xl rounded-xl text-white font-bold w-full py-3 transition-all duration-300"
                            style={{ backgroundColor: SECONDARY_BRAND_COLOR }}
                            disabled={!stripe || processing}
                        >
                            {processing ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span> Processing...
                                </>
                            ) : (
                                <>
                                    <FaLock className="mr-2" /> Pay ${amount} Now
                                </>
                            )}
                        </button>

                        {/* Security Disclaimer */}
                        <p className="text-xs text-gray-500 text-center flex items-center justify-center mt-4">
                            <FaLock className="mr-1 text-sm" /> All payments are securely processed by Stripe.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;