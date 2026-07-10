import React, {
    useState
} from "react";
import API from "../config/api";

const DownloadButton = () => {

    const [message, setMessage] =
        useState("");

    const [remaining, setRemaining] =
        useState(null);





    const handleDownload =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );





                const response =
                    await fetch(

                        `${API}/api/download`,

                        {
                            method: "POST",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );





                const data =
                    await response.json();





                setMessage(
                    data.message
                );





                if (
                    data.downloadsRemaining !== undefined
                ) {

                    setRemaining(
                        data.downloadsRemaining
                    );
                }

            }

            catch (error) {

                console.log(error);

                setMessage(
                    "Server Error"
                );
            }
        };





    return (

        <div
            style={{
                marginTop: "20px"
            }}
        >

            <button

                onClick={handleDownload}

                style={{
                    padding: "10px 20px",
                    cursor: "pointer"
                }}
            >

                Download Video

            </button>





            {
                message && (

                    <p
                        style={{
                            marginTop: "10px"
                        }}
                    >

                        {message}

                    </p>
                )
            }





            {
                remaining !== null && (

                    <p>

                        Downloads Remaining:
                        {" "}
                        {remaining}

                    </p>
                )
            }

        </div>
    );
};

export default DownloadButton;