"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  BanknotesIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import ReviewModal from "@/components/field/review-modal";
import TicketModal from "@/components/ticket-modal";

// Definisi Props biar aman
interface MyReservationListProps {
  reservations: any[]; // Data booking yang udah diambil di server
}

export default function MyReservationList({
  reservations,
}: MyReservationListProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          label: "VERIFIED",
        };
      case "UNPAID":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-100",
          label: "VERIFYING",
        };
      case "CANCELLED":
      case "REJECTED":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-100",
          label: "DROPPED",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-100",
          label: status,
        };
    }
  };

  return (
    <>
      {/* MODAL TIKET (Muncul kalo ada yang dipilih) */}
      {selectedTicket && (
        <TicketModal
          reservation={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <SparklesIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No bookings yet? Seriously?
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Your schedule is literally empty. Let's fix that ASAP.
          </p>
          <Link
            href="/field"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#f64e42] text-white font-semibold rounded-full hover:bg-[#d93d32] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Find a Court Now <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {reservations.map((res) => {
            const statusStyle = getStatusStyle(res.Payment?.status || "UNPAID");
            const isPaid = res.Payment?.status === "PAID";
            const hasReview = res.Review; // Note: Pastikan di query server include Review

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-6 sm:flex gap-8">
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full sm:w-64 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 mb-6 sm:mb-0 shadow-inner">
                    <Image
                      src={res.Field.image || "/card-lapangan.jpg"}
                      alt={res.Field.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30 inline-block">
                        {res.Field.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#f64e42] transition-colors">
                            {res.Field.name}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-1">
                            {res.Field.address}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statusStyle.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-y-3 text-sm text-gray-600 mt-6">
                        <div className="flex items-center gap-3">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {new Date(res.startDate).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                          <span>
                            {new Date(res.startDate).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            -{" "}
                            {new Date(res.endDate).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-50 mt-2">
                          <BanknotesIcon className="h-5 w-5 text-gray-400" />
                          <span className="font-bold text-[#f64e42] text-lg">
                            Rp {res.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-gray-300 text-xs ml-auto font-mono">
                            REF: {res.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION FOOTER */}
                {res.Payment?.status === "UNPAID" && (
                  <div className="bg-amber-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-100">
                    <div className="flex items-center gap-3 text-amber-800 text-sm">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </div>
                      <p>
                        <span className="font-bold">Payment in review.</span>{" "}
                        Hang tight, admin is checking your slip.
                      </p>
                    </div>
                    <Link
                      href={`/booking/payment/${res.id}`}
                      className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-6 py-2.5 rounded-full transition-all w-full sm:w-auto text-center shadow-md"
                    >
                      View Payment
                    </Link>
                  </div>
                )}

                {isPaid && (
                  <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:bg-gray-50">
                    {/* Tombol Tiket */}
                    <button
                      onClick={() => setSelectedTicket(res)}
                      className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#f64e42] transition-colors bg-white border border-gray-200 hover:border-[#f64e42] px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto justify-center"
                    >
                      <TicketIcon className="w-5 h-5" />
                      View E-Ticket
                    </button>

                    {/* Review Section */}
                    {hasReview ? (
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <StarSolid
                              key={i}
                              className={`h-4 w-4 ${
                                i < hasReview.rating ? "" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 italic truncate max-w-[150px]">
                          "{hasReview.comment}"
                        </span>
                      </div>
                    ) : (
                      <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                        <ReviewModal
                          reservationId={res.id}
                          fieldId={res.fieldId}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
