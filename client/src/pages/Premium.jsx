import React from "react";
import Navbar from "../components/Navbar";


const Premium = () => {


    const upgradePlan = async (plan, amount) => {


        const token =
            localStorage.getItem("token");



        if (!token) {

            alert("Please login first");

            return;

        }



        try {


            // CREATE ORDER


            const orderResponse =
                await fetch(
                    "http://localhost:5000/api/payment/create-order",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },


                        body: JSON.stringify({

                            amount: amount,

                            plan: plan

                        })

                    }
                );



            const orderData =
                await orderResponse.json();



            console.log(
                "ORDER DATA:",
                orderData
            );



            if (!orderResponse.ok) {


                alert(
                    orderData.message ||
                    "Order creation failed"
                );


                return;

            }





            if (!window.Razorpay) {

                alert(
                    "Razorpay SDK not loaded"
                );

                return;

            }





            // RAZORPAY OPTIONS


            const options = {


                key:
                    orderData.key,


                amount:
                    orderData.order.amount,


                currency:
                    "INR",


                name:
                    "VINORA",


                description:
                    `${plan} Premium Plan`,


                order_id:
                    orderData.order.id,



                handler:
                    async function (response) {



                        console.log(
                            "PAYMENT RESPONSE:",
                            response
                        );



                        // VERIFY PAYMENT


                        const verifyResponse =
                            await fetch(

                                "http://localhost:5000/api/payment/verify-payment",

                                {

                                    method: "POST",


                                    headers: {

                                        "Content-Type":
                                            "application/json",


                                        Authorization:
                                            `Bearer ${token}`

                                    },


                                    body: JSON.stringify({

                                        razorpay_order_id:
                                            response.razorpay_order_id,


                                        razorpay_payment_id:
                                            response.razorpay_payment_id,


                                        razorpay_signature:
                                            response.razorpay_signature,


                                        plan:
                                            plan

                                    })

                                }

                            );




                        const verifyData =
                            await verifyResponse.json();



                        console.log(
                            "VERIFY DATA:",
                            verifyData
                        );



                        if (verifyResponse.ok) {

                            alert(
                                "Premium Activated Successfully"
                            );

                            localStorage.setItem(
                                "user",
                                JSON.stringify(verifyData.user)
                            );

                            window.location.href = "/profile";

                        }

                        else {


                            alert(
                                verifyData.message
                            );


                        }


                    }



            };




            const razorpay =
                new window.Razorpay(options);




            razorpay.on(
                "payment.failed",
                function (error) {


                    console.log(
                        "PAYMENT FAILED:",
                        error
                    );


                    alert(
                        "Payment Failed"
                    );


                }
            );



            razorpay.open();



        }



        catch (error) {


            console.log(
                "ERROR:",
                error
            );


            alert(
                "Something went wrong"
            );


        }



    };






    return (

        <div
            style={{

                background: "#0f0f0f",

                color: "white",

                minHeight: "100vh"

            }}
        >


            <Navbar />



            <div
                style={{

                    padding: "30px"

                }}
            >



                <h1>
                    Premium Plans
                </h1>




                <PlanCard

                    name="Bronze"

                    price={10}

                    description="7 Minutes Watch Time"

                    onUpgrade={upgradePlan}

                />



                <PlanCard

                    name="Silver"

                    price={50}

                    description="10 Minutes Watch Time"

                    onUpgrade={upgradePlan}

                />



                <PlanCard

                    name="Gold"

                    price={100}

                    description="Unlimited Watch Time & Downloads"

                    onUpgrade={upgradePlan}

                />




            </div>



        </div>


    );


};





const PlanCard = ({
    name,
    price,
    description,
    onUpgrade
}) => {


    return (

        <div

            style={{

                background: "#1c1c1c",

                padding: "20px",

                marginTop: "20px",

                borderRadius: "10px"

            }}

        >


            <h2>

                {name} Plan - ₹{price}

            </h2>


            <p>
                {description}
            </p>



            <button

                onClick={() =>
                    onUpgrade(
                        name,
                        price
                    )
                }


                style={{

                    padding: "10px 20px",

                    cursor: "pointer"

                }}

            >

                Upgrade

            </button>



        </div>

    );

};



export default Premium;