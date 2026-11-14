import { Drawer } from "@/components/ui/Drawer";
import { useDirectorFormManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorFormManager";
import { DirectorProfile } from "@/types/directors";
import { DirectorProfileFormFields } from "../../shared/DirectorProfileFormFields";

function DirectorEditForm({ director, onClose }: { director: DirectorProfile; onClose: () => void }) {
    const manager = useDirectorFormManager(director, onClose);
    return (
        <div className="min-h-full bg-gray-50/50 p-4 pb-32">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-lg border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <DirectorProfileFormFields manager={manager} />
            </div>
        </div>
    );
}

export function DirectorProfileFormDrawer({ director, isOpen, onClose }: { director: DirectorProfile | null; isOpen: boolean; onClose: () => void }) {
    return (
        <Drawer title="Edit Director Profile" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {director && <DirectorEditForm key={director.id} director={director} onClose={onClose} />}
        </Drawer>
    );
}
