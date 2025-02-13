import { useState } from "react";
import { z } from "zod";
import { BookingDetails } from "../lib/type";
import { viewBookingSchema } from "../lib/validationBooking";
import { formatRupiah } from "../lib/utils";
import apiClient, {
  BASE_URL_STORAGE,
  isAxiosError,
} from "../services/apiService";

export default function CheckBooking() {
  const [formData, setFormData] = useState({
    phone_number: "",
    booking_trx_id: "",
  });

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<null | BookingDetails>(
    null
  );

  const [error, setError] = useState<null | string>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Validating form...");
    const validation = viewBookingSchema.safeParse(formData);

    if (!validation.success) {
      console.error("Validation failed:", validation.error.issues);
      setFormErrors(validation.error.issues);
      return;
    }

    console.log("Form is valid:", formData);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/check-booking", {
        ...formData,
        //
      });

      console.log("We are checking the booking details:", response.data.data);
      setBookingDetails(response.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.log("Server response:", error.response?.data); // Tambahkan ini
        setError(
          error.response?.data?.message || "An error occurred while booking."
        );
      } else {
        console.error("Unknown error:", error);
        setError("An error occurred while booking.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        id="Banner"
        className="relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]"
      >
        <h1 className="text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20">
          View Your Booking Details
        </h1>
        <div className="absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10" />
        <img
          src="/assets/images/thumbnails/thumbnail-details-5.png"
          className="absolute w-full h-full object-cover object-top"
          alt=""
        />
      </div>
      <section
        id="Check-Booking"
        className="relative flex flex-col w-[930px] shrink-0 gap-[30px] mx-auto mb-[100px] z-20"
      >
        <form
          onSubmit={handleFormSubmit}
          className="flex items-end rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[16px] bg-white"
        >
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="font-semibold">
              Booking TRX ID
            </label>
            <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
              <img
                src="/assets/images/icons/receipt-text-black.svg"
                className="w-6 h-6"
                alt="icon"
              />
              <input
                type="text"
                name="booking_trx_id"
                id="booking_trx_id"
                value={formData.booking_trx_id}
                onChange={handleInputChange}
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                placeholder="Write your booking trx id"
              />
            </div>
            {formErrors.find((error) =>
              error.path.includes("booking_trx_id")
            ) && (
              <span className="text-red-500">
                {
                  formErrors.find((error) =>
                    error.path.includes("booking_trx_id")
                  )?.message
                }
              </span>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="phone" className="font-semibold">
              Phone Number
            </label>
            <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
              <img
                src="/assets/images/icons/call-black.svg"
                className="w-6 h-6"
                alt="icon"
              />
              <input
                type="number"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                placeholder="Write your valid number"
              />
            </div>
            {formErrors.find((error) =>
              error.path.includes("phone_number")
            ) && (
              <span className="text-red-500">
                {
                  formErrors.find((error) =>
                    error.path.includes("phone_number")
                  )?.message
                }
              </span>
            )}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center justify-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
          >
            <span className="text-nowrap">
              {isLoading ? "Loading..." : "Check Booking"}
            </span>
          </button>
        </form>

        {bookingDetails ? (
          <div id="Result" className="grid grid-cols-2 gap-[30px]">
            <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
              <div className="flex items-center gap-4">
                <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden">
                  <img
                    src={`${BASE_URL_STORAGE}/${bookingDetails.office.thumbnail}`}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-xl leading-[30px]">
                    {bookingDetails.office.name}
                  </p>
                  <div className="flex items-center gap-[6px]">
                    <img
                      src="/assets/images/icons/location.svg"
                      className="w-6 h-6"
                      alt="icon"
                    />
                    <p className="font-semibold">
                      {bookingDetails.office.city.name}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <div className="flex flex-col gap-4">
                <h2 className="font-bold">Customer Details</h2>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Full Name</h3>
                  <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                    <img
                      src="/assets/images/icons/security-user-black.svg"
                      className="w-6 h-6"
                      alt="icon"
                    />
                    <p className="font-semibold">{bookingDetails.name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Phone Number</h3>
                  <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                    <img
                      src="/assets/images/icons/call-black.svg"
                      className="w-6 h-6"
                      alt="icon"
                    />
                    <p className="font-semibold">
                      {bookingDetails.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Started At</h3>
                  <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                    <img
                      src="/assets/images/icons/calendar-black.svg"
                      className="w-6 h-6"
                      alt="icon"
                    />
                    <p className="font-semibold">{bookingDetails.started_at}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Ended At</h3>
                  <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                    <img
                      src="/assets/images/icons/calendar-black.svg"
                      className="w-6 h-6"
                      alt="icon"
                    />
                    <p className="font-semibold">{bookingDetails.ended_at}</p>
                  </div>
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <div className="flex items-center gap-3">
                <img
                  src="/assets/images/icons/shield-tick.svg"
                  className="w-[30px] h-[30px]"
                  alt="icon"
                />
                <p className="font-semibold leading-[28px]">
                  Privasi Anda aman bersama kami.
                </p>
              </div>
            </div>
            <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
              <h2 className="font-bold">Order Details</h2>
              <div className="flex flex-col gap-5">
                {bookingDetails.is_paid ? (
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Status Pembayaran</p>
                    <p className="rounded-full w-fit p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]">
                      SUCCESS
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Status Pembayaran</p>
                    <p className="rounded-full w-fit p-[6px_16px] bg-[#FF852D] font-bold text-sm leading-[21px] text-[#F7F7FD]">
                      PENDING
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="font-semibold">Booking TRX ID</p>
                  <p className="font-bold">{bookingDetails.booking_trx_id}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Duration</p>
                  <p className="font-bold">{bookingDetails.duration}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total Amount</p>
                  <p className="font-bold text-[22px] leading-[33px] text-[#0D903A]">
                    {formatRupiah(bookingDetails.total_amount)}
                  </p>
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <h2 className="font-bold">Bonus Packages For You</h2>
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/images/icons/coffee.svg"
                    className="w-[34px] h-[34px]"
                    alt="icon"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-bold">Extra Snacks</p>
                    <p className="text-sm leading-[21px]">Work-Life Balance</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/images/icons/group.svg"
                    className="w-[34px] h-[34px]"
                    alt="icon"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-bold">Free Move</p>
                    <p className="text-sm leading-[21px]">Anytime 24/7</p>
                  </div>
                </div>
              </div>
              <hr className="border-[#F6F5FD]" />
              <a
                href="https://wa.me/621234567890?text=Halo,%20saya%20mengalami%20masalah%20saat%20check%20booking"
                target="_blank"
                className="flex items-center justify-center w-full rounded-full border border-[#000929] p-[12px_20px] gap-3 bg-white font-semibold"
              >
                <img
                  src="/assets/images/icons/call-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <span>Call Customer Service</span>
              </a>
            </div>
          </div>
        ) : (
          <h1 className="text-4xl text-center font-bold text-red-500">
            {error}
          </h1>
        )}
      </section>
    </>
  );
}
