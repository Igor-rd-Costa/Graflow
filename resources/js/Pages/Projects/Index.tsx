import ApplicationLogo from "@/Components/ApplicationLogo";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateProjectFrom from "@/Components/Projects/CreateProjectFrom";
import ProjectCard from "@/Components/Projects/ProjectCard";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/Types";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export type Project = {
    id: number
    name: string,
    file_name: string,
    user_id: number,
    created_at: string,
    updated_at: string
};

type ProjectProps = {
    auth: { user : User },
    projects: Project[]
}


export default function Index({ auth, projects } : ProjectProps) {
    const [isFormVisible, setIsFormVisible ] = useState(false);

    function ShowForm() {
        setIsFormVisible(true);
    }

    function HideForm() {
        setIsFormVisible(false);
    }
    
    return (
        <>
            {isFormVisible && <CreateProjectFrom onCancel={HideForm} onSubmit={HideForm}></CreateProjectFrom>}
            <Authenticated
                user={auth.user}
                header={
                    <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        <PrimaryButton onClick={ShowForm}>
                            <ApplicationLogo className="h-5 w-auto pr-3 fill-white"></ApplicationLogo>
                            Create Project
                        </PrimaryButton>
                    </div>
                }
                >
                <Head title="Projects" />
                <section className="h-[calc(100vh-87px-66px)] overflow-scroll grid grid-cols-5 turquoise-background">
                    { projects.map(project => <ProjectCard key={project.id} project={project} ></ProjectCard>)}
                </section>
            </Authenticated>
        </>
    );
}