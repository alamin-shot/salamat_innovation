"use client";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Plus, Users, QrCode, Edit, Trash2 } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function EventDashboard({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    return (
        <div className="flex flex-col h-full gap-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Events</p>
                        <p className="text-lg font-black text-gray-900 leading-tight">{manager.events.length}</p>
                    </div>
                </div>
                {/* ... other 3 metric cards following identical structure ... */}
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <input type="text" placeholder="Search events..." className="erp-input w-64 bg-white" />
                    <Button variant="default" size="sm" onClick={() => manager.setDrawerMode("event")} className="h-8"><Plus className="w-3.5 h-3.5 mr-1" /> Schedule Event</Button>
                </div>

                <Table containerClassName="flex-1 overflow-x-auto w-full">
                    <TableHeader>
                        <TableHeadCell>Event Details</TableHeadCell>
                        <TableHeadCell>Date & Time</TableHeadCell>
                        <TableHeadCell>Capacity & RSVPs</TableHeadCell>
                        <TableHeadCell>Badge Link</TableHeadCell>
                        <TableHeadCell className="text-right">Actions</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.events.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10 text-gray-400 text-xs">No active events.</TableCell></TableRow>
                        ) : manager.events.map(event => (
                            <TableRow key={event.id}>
                                <TableCell>
                                    <span className="font-bold text-gray-900 text-xs">{event.title}</span>
                                    <p className="text-[10px] text-gray-500">{event.location}</p>
                                </TableCell>
                                <TableCell className="text-xs font-mono text-gray-600">{new Date(event.startDateTime).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="w-48">
                                        <div className="flex justify-between text-[9px] font-bold mb-1 text-gray-500">
                                            <span>{event.rsvps.length} Confirmed</span>
                                            <span>{event.capacityLimit === 0 ? "No Limit" : `Max ${event.capacityLimit}`}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full" style={{ width: event.capacityLimit ? `${(event.rsvps.length / event.capacityLimit) * 100}%` : '100%' }}></div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded text-[9px] font-bold">None</span></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="outline" size="icon-sm" title="Print QR Scanner Code"><QrCode className="w-3.5 h-3.5" /></Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => { manager.setActiveRecord(event); manager.setDrawerMode("event"); }}><Edit className="w-3.5 h-3.5 text-gray-600" /></Button>
                                        <Button variant="destructive-ghost" size="icon-sm"><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}