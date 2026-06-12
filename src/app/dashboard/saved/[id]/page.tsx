import { SavedScriptView } from "@/components/dashboard/saved-script-view";

export default function SavedScriptPage({
    params,
}: {
    params: { id: string };
}) {
    return <SavedScriptView scriptId={params.id} />;
}
