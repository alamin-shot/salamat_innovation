import { Drawer } from "@/components/ui/Drawer";
import { useDirectorFormManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorFormManager";
import { DirectorProfileFormFields } from "../../shared/DirectorProfileFormFields";
import { DirectorProfile } from "@/hooks/people_hooks/director_profile_hooks/useDirectorProfileStore";

export function DirectorProfileFormDrawer({
    initialRecord, isOpen, onClose
}: {
    initialRecord: DirectorProfile | null; isOpen: boolean; onClose: () => void;
}) {
    const manager = useDirectorFormManager(initialRecord, onClose);
    if (!isOpen) return null;

    return (
        <Drawer title="update_directors" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-5xl mx-auto">
                    <DirectorProfileFormFields manager={manager} />
                </div>
            </div>
        </Drawer>
    );
}