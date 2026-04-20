import { useState } from "react";
import { X, Calendar, Clock, Users, DollarSign, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { useSchedules, useAvailability, useCreateBooking, Schedule, Availability } from "@/hooks/useBooking";

interface BookingModalProps {
  listingId: string;
  listingName: string;
  onClose: () => void;
}

type Step = "schedule" | "time" | "details" | "confirm" | "success";

export function BookingModal({ listingId, listingName, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>("schedule");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [numSpots, setNumSpots] = useState(1);
  const [form, setForm] = useState({
    parent_name: "", parent_email: "", parent_phone: "",
    child_name: "", child_age: "", notes: "",
  });

  const { data: schedulesData, isLoading: schedulesLoading } = useSchedules(listingId);
  const { data: availData, isLoading: availLoading } = useAvailability(selectedSchedule?.id || "");
  const { mutate: createBooking, isPending: booking } = useCreateBooking();

  const schedules = schedulesData?.data || [];
  const availability = availData?.data || [];

  const totalPrice = selectedSchedule ? selectedSchedule.price * numSpots : 0;

  const handleBook = () => {
    if (!selectedSchedule || !selectedSlot) return;
    createBooking({
      listing_id: listingId,
      schedule_id: selectedSchedule.id,
      availability_id: selectedSlot.id,
      parent_name: form.parent_name,
      parent_email: form.parent_email,
      parent_phone: form.parent_phone,
      child_name: form.child_name,
      child_age: parseInt(form.child_age) || 0,
      num_spots: numSpots,
      notes: form.notes,
    }, {
      onSuccess: () => setStep("success"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <div>
            <h2 className="font-bold text-gray-900">Book Now</h2>
            <p className="text-xs text-gray-500 truncate max-w-[250px]">{listingName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h3>
              <p className="text-gray-500 mb-2">
                A confirmation has been sent to <strong>{form.parent_email}</strong>
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {selectedSchedule?.title} · {selectedSlot?.date} at {selectedSlot?.start_time}
              </p>
              <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-green-800 mb-1">Booking Summary</p>
                <p className="text-sm text-green-700">{listingName}</p>
                <p className="text-sm text-green-700">{numSpots} spot{numSpots > 1 ? "s" : ""} · ${totalPrice.toFixed(2)}</p>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Done
              </button>
            </div>
          )}

          {/* Step: Choose Schedule */}
          {step === "schedule" && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Choose an option</h3>
              {schedulesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No bookable options available yet.</p>
                  <p className="text-sm mt-1">Contact the business directly to book.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSchedule(s); setStep("time"); }}
                      className="w-full text-left p-4 border-2 border-gray-100 hover:border-blue-300 rounded-xl transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600">{s.title}</p>
                          {s.description && <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            {s.duration_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>}
                            {(s.age_min || s.age_max) && <span className="flex items-center gap-1"><Users className="w-3 h-3" />Ages {s.age_min}-{s.age_max === 99 ? "adult" : s.age_max}</span>}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-blue-600 text-lg">
                            {s.price === 0 ? "FREE" : `$${s.price}`}
                          </p>
                          <p className="text-xs text-gray-400">{s.price_label}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step: Choose Time */}
          {step === "time" && selectedSchedule && (
            <div>
              <button onClick={() => setStep("schedule")} className="text-sm text-blue-600 hover:underline mb-4 block">← Back</button>
              <h3 className="font-semibold text-gray-900 mb-1">{selectedSchedule.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Select a date & time</p>
              {availLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : availability.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No available times right now.</div>
              ) : (
                <div className="space-y-2">
                  {availability.map((slot) => {
                    const remaining = slot.spots_total - slot.spots_booked;
                    const full = remaining <= 0;
                    return (
                      <button
                        key={slot.id}
                        disabled={full}
                        onClick={() => { setSelectedSlot(slot); setStep("details"); }}
                        className={`w-full text-left p-4 border-2 rounded-xl transition-all ${
                          full ? "border-gray-100 opacity-50 cursor-not-allowed" :
                          "border-gray-100 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              {new Date(slot.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5 ml-6">
                              {slot.start_time}{slot.end_time ? ` – ${slot.end_time}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            {full ? (
                              <span className="text-xs font-medium text-red-500">Full</span>
                            ) : (
                              <span className={`text-xs font-medium ${remaining <= 3 ? "text-orange-500" : "text-green-600"}`}>
                                {remaining} spot{remaining !== 1 ? "s" : ""} left
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step: Details */}
          {step === "details" && selectedSchedule && selectedSlot && (
            <div>
              <button onClick={() => setStep("time")} className="text-sm text-blue-600 hover:underline mb-4 block">← Back</button>
              <h3 className="font-semibold text-gray-900 mb-4">Your details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Number of spots</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button onClick={() => setNumSpots(Math.max(1, numSpots - 1))} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 transition-colors">-</button>
                    <span className="font-semibold text-lg w-8 text-center">{numSpots}</span>
                    <button onClick={() => setNumSpots(Math.min(selectedSlot.spots_total - selectedSlot.spots_booked, numSpots + 1))} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 transition-colors">+</button>
                    <span className="text-sm text-gray-400">× ${selectedSchedule.price} = <strong className="text-gray-900">${totalPrice.toFixed(2)}</strong></span>
                  </div>
                </div>
                {[
                  { key: "parent_name", label: "Parent name *", type: "text", placeholder: "Jane Smith" },
                  { key: "parent_email", label: "Email *", type: "email", placeholder: "jane@email.com" },
                  { key: "parent_phone", label: "Phone", type: "tel", placeholder: "(561) 555-0100" },
                  { key: "child_name", label: "Child's name", type: "text", placeholder: "Emma" },
                  { key: "child_age", label: "Child's age", type: "number", placeholder: "7" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes (optional)</label>
                  <textarea
                    placeholder="Any special requirements..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep("confirm")}
                disabled={!form.parent_name || !form.parent_email}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Booking
              </button>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && selectedSchedule && selectedSlot && (
            <div>
              <button onClick={() => setStep("details")} className="text-sm text-blue-600 hover:underline mb-4 block">← Back</button>
              <h3 className="font-semibold text-gray-900 mb-4">Review your booking</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Activity</span><span className="font-medium text-right max-w-[200px]">{selectedSchedule.title}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(selectedSlot.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot.start_time}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Spots</span><span className="font-medium">{numSpots}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Name</span><span className="font-medium">{form.parent_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium">{form.parent_email}</span></div>
                {form.child_name && <div className="flex justify-between text-sm"><span className="text-gray-500">Child</span><span className="font-medium">{form.child_name}{form.child_age ? `, age ${form.child_age}` : ""}</span></div>}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold"><span>Total</span><span className="text-blue-600">{selectedSchedule.price === 0 ? "FREE" : `$${totalPrice.toFixed(2)}`}</span></div>
              </div>
              <p className="text-xs text-gray-400 mb-4 text-center">By booking you agree to the cancellation policy. Payment collected at the venue.</p>
              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : `Confirm Booking${selectedSchedule.price > 0 ? ` · $${totalPrice.toFixed(2)}` : ""}`}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
