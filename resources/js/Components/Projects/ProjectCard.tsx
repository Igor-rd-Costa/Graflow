import { router } from "@inertiajs/react";
import PrimaryButton from "../PrimaryButton";
import { Project } from "@/Pages/Projects/Index";
import { MouseEventHandler } from "react";

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({project} : ProjectCardProps) {

    function Delete(e : React.MouseEvent<HTMLButtonElement>) { 
        e.stopPropagation();
        router.delete(route('project.destroy', {project}));
    }

    function LoadProject() {
        router.visit(route('project.index', project.file_name));
    }

    return (
        <div className="w-[16rem] h-[16rem] m-[40px] cursor-pointer" onClick={LoadProject}>
            <div className="bg-white overflow-hidden shadow-lg shadow-gray-700 border border-gray-700 h-full sm:rounded-lg">
                <div className="px-2 py-2 text-lg text-turquoise-500 border-b-[0.1rem]">
                    {project.name}
                    <PrimaryButton onClick={Delete} className="text-sm h-6 float-right">Del</PrimaryButton>
                </div>
                <div className="px-2 pt-2 text-sm">{new Date(project.created_at).toLocaleString()}</div>
                <div className="px-2 text-sm">{new Date(project.updated_at).toLocaleString()}</div>
            </div>
        </div>
    )
}