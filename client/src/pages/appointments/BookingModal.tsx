import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

interface BookingModalProps {
    doctor: any;
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal = ({ doctor, isOpen, onClose }: BookingModalProps) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        setLoading(true);
        try {
            await axios.post('/appointments', {
                doctorId: doctor.doctorId,
                appointmentDate: date,
                appointmentTime: time,
                symptoms // Note: Make sure appointmentTime format matches backend (e.g. ISO string or HH:mm)
            });
            toast.success("Appointment booked successfully!");
            onClose();
            setStep(1); // Reset
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    if (!doctor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        with Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                             <div className="space-y-2">
                                <Label>Select Date</Label>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                             </div>
                             <div className="space-y-2">
                                <Label>Select Time Slot</Label>
                                <Select onValueChange={setTime}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chose a slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="09:00:00">09:00 AM</SelectItem>
                                        <SelectItem value="10:00:00">10:00 AM</SelectItem>
                                        <SelectItem value="11:00:00">11:00 AM</SelectItem>
                                        <SelectItem value="14:00:00">02:00 PM</SelectItem>
                                        <SelectItem value="15:00:00">03:00 PM</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                        </div>
                    )}

                    {/* Step 2: Symptoms */}
                    {step === 2 && (
                         <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                            <div className="space-y-2">
                                <Label>Describe your symptoms</Label>
                                <Input 
                                    className="h-24 pb-16" // textarea like
                                    value={symptoms} 
                                    onChange={(e) => setSymptoms(e.target.value)} 
                                    placeholder="e.g. Fever, headache since 2 days..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    {step === 1 ? (
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    ) : (
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    )}

                     {step === 1 ? (
                        <Button onClick={() => setStep(2)} disabled={!date || !time}>Next: Symptoms</Button>
                    ) : (
                        <Button onClick={handleBooking} disabled={loading || !symptoms}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Booking'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
