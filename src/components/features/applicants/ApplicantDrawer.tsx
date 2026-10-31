"use client";
import { ApplicantManagerType } from "@/hooks/applicant_hooks/useApplicantManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, User, Calendar, Sparkles, Megaphone } from "lucide-react";

export function ApplicantDrawer({ manager }: { manager: ApplicantManagerType }) {
    const activeApplicant = manager.getActiveApplicant();

    if (!activeApplicant) return null;

    return (
        <Drawer
            title="Applicant Detail"
            isOpen={manager.activeDrawer === "view"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)] md:w-[700px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Header Profile Block */}
                    <div className="flex items-center justify-between bg-white border border-gray-100 shadow-sm rounded-lg p-5">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold text-2xl shrink-0">
                                {activeApplicant.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{activeApplicant.name}</h2>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                    <User className="h-3.5 w-3.5" /> {activeApplicant.jobTitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${activeApplicant.status === 'Shortlisted' ? 'bg-green-50 text-green-600' :
                                    activeApplicant.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                                        'bg-amber-50 text-amber-600'
                                }`}>
                                {activeApplicant.status}
                            </span>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                {activeApplicant.gender}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <Mail className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Email</span>
                                <a href={`mailto:${activeApplicant.email}`} className="text-sm text-blue-600 font-medium mt-0.5 hover:underline">
                                    {activeApplicant.email}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <Phone className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Phone</span>
                                <a href={`tel:${activeApplicant.phone}`} className="text-sm text-gray-900 font-medium mt-0.5 hover:underline">
                                    {activeApplicant.phone}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <User className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Age</span>
                                <span className="text-sm text-gray-900 font-medium mt-0.5">{activeApplicant.age} years</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Applied On</span>
                                <span className="text-sm text-gray-900 font-medium mt-0.5">
                                    {new Date(activeApplicant.appliedOn).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 border-dashed" />

                    {/* Long Form Content */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-amber-500" /> Skills
                            </h3>
                            <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed shadow-sm">
                                {activeApplicant.skills}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <Megaphone className="h-4 w-4 text-blue-500" /> Reason of Join
                            </h3>
                            <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed shadow-sm whitespace-pre-wrap">
                                {activeApplicant.reasonToJoin}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4 pb-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Close</Button>
                </div>
            </div>
        </Drawer>
    );
}